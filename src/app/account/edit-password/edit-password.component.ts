import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { passwordChecker } from 'src/app/functions/password-checker';
import { passwordMatcher } from 'src/app/functions/password-matcher';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { IUser } from 'src/app/types/user';

@Component({
  selector: 'ctacu-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss'],
})
export class EditPasswordComponent implements OnInit {
  @Input() loading: boolean;
  @Input() user: IUser;

  @Output() loadingChange = new EventEmitter<boolean>();

  submitted = false;

  errorMessage = '';
  successMessage = '';
  editPasswordForm: FormGroup;

  private readonly passwordPattern = this.formValidationRuleService
    .passwordPattern as RegExp;

  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly formValidationRuleService: FormValidationRuleService
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
  }

  onSubmit(form: FormGroup, user: IUser): void {
    this.successMessage = '';
    this.errorMessage = '';
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      this.loadingChange.emit(true);
      const passwordControl = form.get('passwordGroup.password');
      const updatedUser = {
        ...user,
        password: passwordControl.value as string,
      } as IUser;
      this.saveUser(form, updatedUser);
    }
  }

  resetForm(form: FormGroup): void {
    form.reset();
    this.submitted = false;
  }

  private updateCurrentPasswordValidators(form: FormGroup, user: IUser): void {
    const currentPasswordControl = form.get('currentPassword');
    currentPasswordControl.setValidators([
      Validators.required,
      passwordChecker(user.password),
    ]);
    currentPasswordControl.updateValueAndValidity();
  }

  private saveUser(form: FormGroup, user: IUser): void {
    this.authService.saveUser(user).subscribe(
      (result) => {
        this.successMessage = 'New password saved!';
        this.resetForm(form);
        this.updateCurrentPasswordValidators(form, user);
        this.loadingChange.emit(false);
      },
      (error) => {
        this.errorMessage = 'There was an error saving your new password.';
        this.loadingChange.emit(false);
        console.error(error);
      }
    );
  }
}
