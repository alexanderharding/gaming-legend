import {
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
import { passwordMatcher } from 'src/app/functions/password-matcher';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { NotificationService } from 'src/app/services/notification.service';
import { INotification } from 'src/app/types/notification';
import { IUser } from 'src/app/types/user';

@Component({
  selector: 'ctacu-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss'],
})
export class EditPasswordComponent implements OnInit, OnDestroy {
  @ViewChild('successTpl') private successTpl: TemplateRef<any>;
  @ViewChild('dangerTpl') private dangerTpl: TemplateRef<any>;

  @Input() loading: boolean;
  @Input() user: IUser;

  @Output() loadingChange = new EventEmitter<boolean>();

  submitted = false;
  editPasswordForm: FormGroup;
  private subscription: Subscription;

  hasValue = false;

  private readonly passwordPattern = this.formValidationRuleService
    .passwordPattern as RegExp;

  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.editPasswordForm = this.fb.group({
      currentPassword: [
        '',
        [Validators.required, passwordChecker(this.user.password)],
      ],
      passwordGroup: this.fb.group(
        {
          password: [
            '',
            [Validators.required, Validators.pattern(this.passwordPattern)],
          ],
          confirmPassword: ['', [Validators.required]],
        },
        { validator: passwordMatcher }
      ),
    });
    const passwordGroupControl = this.editPasswordForm.get('passwordGroup');
    this.subscription = passwordGroupControl.valueChanges.subscribe(() =>
      this.setHasValueChanged(passwordGroupControl)
    );
  }

  onSubmit(form: FormGroup): void {
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      this.loadingChange.emit(true);
      this.saveUser(form);
    }
  }

  resetForm(form: FormGroup): void {
    form.reset();
    this.submitted = false;
  }

  private setHasValueChanged(c: AbstractControl): void {
    const passwordControl = c.get('password');
    const confirmPasswordControl = c.get('confirmPassword');
    this.hasValue =
      passwordControl.value || confirmPasswordControl.value ? true : false;
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

  private updateCurrentPasswordValidators(form: FormGroup, user: IUser): void {
    const currentPasswordControl = form.get('currentPassword');
    currentPasswordControl.setValidators([
      Validators.required,
      passwordChecker(user.password),
    ]);
    currentPasswordControl.updateValueAndValidity();
  }

  private saveUser(form: FormGroup): void {
    const passwordControl = form.get('passwordGroup.password');
    const updatedUser = {
      ...this.user,
      password: passwordControl.value as string,
    } as IUser;
    this.authService.saveUser(updatedUser).subscribe(
      (user) => {
        this.resetForm(form);
        this.updateCurrentPasswordValidators(form, user);
        this.showSuccess();
      },
      (error) => {
        this.showDanger();
        console.error(error);
      },
      () => this.loadingChange.emit(false)
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
