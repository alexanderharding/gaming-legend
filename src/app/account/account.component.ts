import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordMatcher } from '../functions/password-matcher';
import { AuthService } from '../services/auth.service';
import { FormValidationRuleService } from '../services/form-validation-rule.service';
import { IUser } from '../types/user';

@Component({
  selector: 'ctacu-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  submitted = false;
  readonly user$ = this.authService.currentUser$;
  private readonly passwordPattern = this.formValidationRuleService
    .passwordPattern as RegExp;

  editPasswordForm: FormGroup;
  invalidPasswordMessage = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly formValidationRuleService: FormValidationRuleService
  ) {}

  ngOnInit(): void {
    this.editPasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
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
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      const currentPasswordControl = form.get('currentPassword');
      if (currentPasswordControl.value.toString() === user.password) {
        const updatedUser = {
          ...user,
          password: currentPasswordControl.value as string,
        } as IUser;
        this.saveUser(updatedUser);
      }
    }
  }

  setInvalidPasswordMessage(message: string): void {
    this.invalidPasswordMessage = message;
  }

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['/']);
  }

  private saveUser(user: IUser): void {
    this.authService.saveUser(user).subscribe(
      (result) => {
        this.successMessage = 'New password saved!';
        this.editPasswordForm.reset();
        this.submitted = false;
      },
      (error) =>
        (this.errorMessage = 'There was an error saving your new password.')
    );
  }
}
