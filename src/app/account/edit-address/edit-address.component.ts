import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { passwordChecker } from 'src/app/functions/password-checker';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { NotificationService } from 'src/app/services/notification.service';
import { IUser, User } from 'src/app/types/user';

@Component({
  selector: 'ctacu-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss'],
})
export class EditAddressComponent implements OnInit {
  @ViewChild('successTpl') private successTpl: TemplateRef<any>;
  @ViewChild('dangerTpl') private dangerTpl: TemplateRef<any>;
  submitted = false;
  editForm: FormGroup;

  @Input() user: IUser;
  @Input() loading: boolean;

  @Output() onLoadingChange = new EventEmitter<boolean>();

  readonly streetMinLength = +this.formValidationRuleService.streetMinLength;
  readonly streetMaxLength = +this.formValidationRuleService.streetMaxLength;
  readonly cityMinLength = +this.formValidationRuleService.cityMinLength;
  readonly cityMaxLength = +this.formValidationRuleService.cityMaxLength;
  private readonly zipPattern = this.formValidationRuleService
    .zipPattern as RegExp;

  get hasChanged(): boolean {
    const address = JSON.stringify(
      this.editForm.get('addressGroup').value
    ).toLowerCase();
    const userAddressValue = JSON.stringify(this.user.address).toLowerCase();
    return address !== userAddressValue;
  }

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

    addressControl.setValue({
      street: address.street as string,
      city: address.city as string,
      state: address.state as string,
      zip: address.zip as string,
      country: address.country as string,
    });
  }

  private showSuccess(): void {
    this.notificationService.show(this.successTpl, {
      classname: 'bg-success text-light',
      delay: 10000,
    });
  }

  private showDanger(): void {
    this.notificationService.show(this.dangerTpl, {
      classname: 'bg-danger text-light',
      delay: 15000,
    });
  }

  private saveUser(form: FormGroup): void {
    const updatedUser = {
      ...this.user,
      address: {
        ...this.user.address,
        street: form.get('addressGroup.street').value as string,
        city: form.get('addressGroup.city').value as string,
        state: form.get('addressGroup.state').value as string,
        zip: form.get('addressGroup.zip').value as string,
      },
    } as IUser;
    this.authService.saveUser(updatedUser).subscribe(
      (result) => {
        this.onLoadingChange.emit(false);
        this.showSuccess();
        this.resetForm(form, result);
      },
      (error) => {
        this.onLoadingChange.emit(false);
        this.showDanger();
      }
    );
  }
}
