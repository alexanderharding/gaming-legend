import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';
import { emailMatcher } from 'src/app/functions/email-matcher';
import { passwordChecker } from 'src/app/functions/password-checker';
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
  emailTakenMessage: string;

  loading = false;

  @Input() user: IUser;

  private readonly phonePattern = this.formValidationRuleService
    .phonePattern as RegExp;

  // get hasChanged(): boolean {
  //   // const form = this.editForm.get('contactGroup').value.delete['confirmEmail'];
  //   // const formValue = JSON.stringify(form).toLowerCase();
  //   const userContactValue = JSON.stringify(this.user.contact).toLowerCase();
  //   return formValue !== userContactValue;
  // }

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      currentPassword: [
        '',
        [Validators.required, passwordChecker(this.user.password)],
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

  resetForm(form: FormGroup, user: IUser): void {
    this.submitted = false;
    const contact = user.contact;
    form.reset();
    form.patchValue({
      contactGroup: {
        phone: contact.phone as string,
        email: contact.email as string,
        confirmEmail: contact.email as string,
      },
    });
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
