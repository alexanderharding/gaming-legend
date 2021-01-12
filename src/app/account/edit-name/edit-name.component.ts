import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { passwordChecker } from 'src/app/functions/password-checker';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { NotificationService } from 'src/app/services/notification.service';
import { INotification } from 'src/app/types/notification';
import { IUser, User } from 'src/app/types/user';

@Component({
  selector: 'ctacu-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditNameComponent implements OnInit, OnDestroy {
  submitted = false;
  editForm: FormGroup;
  hasValueChanged = false;

  private subscription: Subscription;

  @ViewChild('successTpl') private successTpl: TemplateRef<any>;
  @ViewChild('dangerTpl') private dangerTpl: TemplateRef<any>;

  @Input() user: IUser;
  @Input() loading: boolean;

  @Output() onLoadingChange = new EventEmitter<boolean>();

  readonly nameMinLength = +this.formValidationRuleService.nameMinLength;
  readonly nameMaxLength = +this.formValidationRuleService.nameMaxLength;

  constructor(
    private readonly fb: FormBuilder,
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      nameGroup: this.fb.group({
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(this.nameMinLength),
            Validators.maxLength(this.nameMaxLength),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(this.nameMinLength),
            Validators.maxLength(this.nameMaxLength),
          ],
        ],
      }),
      passwordGroup: this.fb.group({
        currentPassword: [
          '',
          [Validators.required, passwordChecker(this.user.password)],
        ],
      }),
    });
    const nameControl = this.editForm.get('nameGroup');
    this.subscription = nameControl.valueChanges.subscribe(() =>
      this.setHasValueChanged(nameControl)
    );
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
    const name = user.name;
    const nameControl = form.get('nameGroup');
    const passwordGroupControl = form.get('passwordGroup');
    this.submitted = false;
    nameControl.setValue({
      firstName: name.firstName,
      lastName: name.lastName,
    });
    passwordGroupControl.patchValue({
      currentPassword: '',
    });
  }

  private setHasValueChanged(c: AbstractControl): void {
    const controlValue = JSON.stringify(c.value).toLowerCase();
    const userNameValue = JSON.stringify(this.user.name).toLowerCase();
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
    const updatedUser = {
      ...this.user,
      name: {
        firstName: form.get('nameGroup.firstName').value as string,
        lastName: form.get('nameGroup.lastName').value as string,
      },
    } as User;
    this.authService.saveUser(updatedUser).subscribe(
      (user) => {
        this.showSuccess();
        this.user = user as IUser;
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
