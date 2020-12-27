import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';
import { emailMatcher } from 'src/app/functions/email-matcher';
import { passwordChecker } from 'src/app/functions/password-checker';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { IUser } from 'src/app/types/user';

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss'],
})
export class EditContactComponent implements OnInit {
  submitted = false;
  editForm: FormGroup;
  errorMessage: string;
  emailTakenMessage: string;

  loading = false;

  private readonly phonePattern = this.formValidationRuleService
    .phonePattern as RegExp;
  readonly user$ = this.authService.currentUser$;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.user$.pipe(first()).subscribe({
      next: (user) =>
        (this.editForm = this.fb.group({
          currentPassword: [
            '',
            [Validators.required, passwordChecker(user.password)],
          ],
          contactGroup: this.fb.group(
            {
              phone: [
                '',
                [Validators.required, Validators.pattern(this.phonePattern)],
              ],
              email: ['', [Validators.required, Validators.email]],
              confirmEmail: ['', Validators.required],
            },
            { validator: emailMatcher }
          ),
        })),
    });
  }
  onSubmit(form: FormGroup, user: IUser): void {
    this.errorMessage = '';
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      this.loading = true;
      const email = this.editForm.get('contactGroup.email').value as string;
      this.authService.checkForUser(email).subscribe(
        (result) => {
          if (result) {
            this.loading = false;
            this.emailTakenMessage = `${email} is already registered to an
               account.`;
          } else {
            const updatedUser = {
              ...user,
              phone: form.get('contactGroup.phone').value as string,
              email: form.get('contactGroup.email').value as string,
            } as IUser;
            this.saveUser(updatedUser);
          }
        },
        (error) => {
          this.loading = false;
          this.errorMessage =
            'There was an error saving your contact information.';
        }
      );
    }
  }

  setEmailTakenMessage(message: string): void {
    this.emailTakenMessage = message;
  }

  private hasValueChanged(form: FormGroup, user: IUser): boolean {
    const phone = form.get('contactGroup.phone').value as string;
    const email = form.get('contactGroup.email').value as string;
    if (
      email.toLowerCase() === user.email.toLowerCase() &&
      phone.toLowerCase() === user.phone.toLowerCase()
    ) {
      return false;
    }
    return true;
  }

  private saveUser(user: IUser): void {
    this.authService.saveUser(user).subscribe(
      (result) => {
        this.loading = false;
        this.router.navigate(['/account']);
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'There was an error saving your name.';
      }
    );
  }
}
