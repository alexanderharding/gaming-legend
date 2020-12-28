import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { passwordChecker } from '../functions/password-checker';
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
  loading = false;
  readonly user$ = this.authService.currentUser$;
  private readonly passwordPattern = this.formValidationRuleService
    .passwordPattern as RegExp;

  editPasswordForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly formValidationRuleService: FormValidationRuleService,

    private readonly config: NgbAccordionConfig
  ) {
    config.closeOthers = true;
  }

  ngOnInit(): void {
    this.user$.pipe(first()).subscribe({
      next: (user) =>
        (this.editPasswordForm = this.fb.group({
          currentPassword: [
            '',
            [Validators.required, passwordChecker(user.password)],
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
        })),
    });
  }

  onSubmit(form: FormGroup, user: IUser): void {
    this.successMessage = '';
    this.errorMessage = '';
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      this.loading = true;
      const currentPasswordControl = form.get('currentPassword');
      const updatedUser = {
        ...user,
        password: currentPasswordControl.value as string,
      } as IUser;
      this.saveUser(updatedUser);
    }
  }

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['/user']);
  }

  resetForm(): void {
    this.editPasswordForm.reset();
    this.submitted = false;
    this.loading = false;
  }

  private saveUser(user: IUser): void {
    this.authService.saveUser(user).subscribe(
      (result) => {
        this.successMessage = 'New password saved!';
        this.resetForm();
      },
      (error) => {
        this.errorMessage = 'There was an error saving your new password.';
        this.loading = false;
        console.error(error);
      }
    );
  }
}
