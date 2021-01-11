import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { passwordChecker } from 'src/app/functions/password-checker';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { NotificationService } from 'src/app/services/notification.service';
import { INotification } from 'src/app/types/notification';
import { IUser } from 'src/app/types/user';

@Component({
  selector: 'ctacu-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAddressComponent implements OnInit {
  submitted = false;
  editForm: FormGroup;
  hasValueChanged = false;

  private subscription: Subscription;

  @ViewChild('successTpl') private successTpl: TemplateRef<any>;
  @ViewChild('dangerTpl') private dangerTpl: TemplateRef<any>;

  @Input() user: IUser;
  @Input() loading: boolean;

  @Output() onLoadingChange = new EventEmitter<boolean>();

  readonly streetMinLength = +this.formValidationRuleService.streetMinLength;
  readonly streetMaxLength = +this.formValidationRuleService.streetMaxLength;
  readonly cityMinLength = +this.formValidationRuleService.cityMinLength;
  readonly cityMaxLength = +this.formValidationRuleService.cityMaxLength;
  private readonly zipPattern = this.formValidationRuleService
    .zipPattern as RegExp;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      currentPassword: [
        '',
        [Validators.required, passwordChecker(this.user.password)],
      ],
      addressGroup: this.fb.group({
        street: [
          '',
          [
            Validators.required,
            Validators.minLength(this.streetMinLength),
            Validators.maxLength(this.streetMaxLength),
          ],
        ],
        city: [
          '',
          [
            Validators.required,
            Validators.minLength(this.cityMinLength),
            Validators.maxLength(this.cityMaxLength),
          ],
        ],
        state: ['', [Validators.required]],
        zip: ['', [Validators.required, Validators.pattern(this.zipPattern)]],
        country: ['USA', [Validators.required]],
      }),
    });
    const addressControl = this.editForm.get('addressGroup');
    this.subscription = addressControl.valueChanges.subscribe(() =>
      this.setHasValueChanged(addressControl)
    );
    if (!this.user.address) {
      this.hasValueChanged = true;
    }
  }

  onSubmit(form: FormGroup): void {
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      this.onLoadingChange.emit(true);
      this.saveUser(form);
    }
  }

  resetForm(form: FormGroup, user: IUser): void {
    const address = user.address;
    const addressControl = form.get('addressGroup');
    this.submitted = false;
    form.reset();
    if (address) {
      addressControl.setValue({
        street: address.street as string,
        city: address.city as string,
        state: address.state as string,
        zip: address.zip as string,
        country: address.country as string,
      });
    } else {
      addressControl.patchValue({
        state: '',
        country: 'USA',
      });
    }
  }

  private setHasValueChanged(c: AbstractControl): void {
    if (!this.user.address) {
      this.hasValueChanged = true;
      return;
    }
    const controlValue = JSON.stringify(c.value).toLowerCase();
    const userNameValue = JSON.stringify(this.user.address).toLowerCase();
    this.hasValueChanged = controlValue === userNameValue ? false : true;
  }

  private showSuccess(): void {
    const notification = {
      textOrTpl: this.successTpl,
      className: 'bg-success text-light',
      delay: 10000,
    } as INotification;
    this.notificationService.show(notification);
  }

  private showDanger(): void {
    const notification = {
      textOrTpl: this.dangerTpl,
      className: 'bg-danger text-light',
      delay: 15000,
    } as INotification;
    this.notificationService.show(notification);
  }

  private saveUser(form: FormGroup): void {
    let updatedUser: IUser;
    if (this.user.address) {
      updatedUser = {
        ...this.user,
        address: {
          ...this.user.address,
          street: form.get('addressGroup.street').value as string,
          city: form.get('addressGroup.city').value as string,
          state: form.get('addressGroup.state').value as string,
          zip: form.get('addressGroup.zip').value as string,
          country: form.get('addressGroup.country').value as string,
        },
      } as IUser;
    } else {
      updatedUser = {
        ...this.user,
        address: {
          street: form.get('addressGroup.street').value as string,
          city: form.get('addressGroup.city').value as string,
          state: form.get('addressGroup.state').value as string,
          zip: form.get('addressGroup.zip').value as string,
          country: form.get('addressGroup.country').value as string,
        },
      } as IUser;
    }
    this.authService.saveUser(updatedUser).subscribe(
      (user) => {
        this.showSuccess();
        this.user = user;
        this.resetForm(form, user);
      },
      (error) => this.showDanger(),
      () => this.onLoadingChange.emit(false)
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
