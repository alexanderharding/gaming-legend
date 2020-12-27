import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { emailMatcher } from 'src/app/functions/email-matcher';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { IUser } from 'src/app/types/user';

@Component({
  selector: 'ctacu-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss'],
})
export class EditContactComponent implements OnInit {
  submitted = false;
  editForm: FormGroup;
  errorMessage: string;
  invalidPasswordMessage: string;
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
    this.editForm = this.fb.group({
      currentPassword: ['', Validators.required],
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
    });
  }
  onSubmit(form: FormGroup, user: IUser): void {
    this.errorMessage = '';
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      const currentPasswordControl = form.get('currentPassword');
      if (currentPasswordControl.value.toString() === user.password) {
        this.loading = true;
        const updatedUser = {
          ...user,
          phone: form.get('contactGroup.phone').value as string,
          email: form.get('contactGroup.email').value as string,
        } as IUser;
        this.saveUser(updatedUser);
      } else {
        this.invalidPasswordMessage = this.formValidationRuleService.invalidPasswordMessage;
      }
    }
  }

  setInvalidPasswordMessage(message: string): void {
    this.invalidPasswordMessage = message;
  }

  setEmailTakenMessage(message: string): void {
    this.emailTakenMessage = message;
  }

  private saveUser(user: IUser): void {
    this.authService.saveUser(user).subscribe(
      (result) => this.router.navigate(['/account']),
      (error) => {
        this.loading = false;
        this.errorMessage = 'There was an error saving your name.';
      }
    );
  }
}
