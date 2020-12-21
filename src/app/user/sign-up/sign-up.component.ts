import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailMatcher } from 'src/app/functions/email-matcher';
import { passwordMatcher } from 'src/app/functions/password-matcher';

@Component({
  selector: 'ctacu-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  submitted = true;

  private readonly nameMinLength = 3;
  private readonly nameMaxLength = 20;

  private readonly firstNameValidationMessages = {
    required: 'Please enter your first name.',
    minlength: `First name must be longer than ${this.nameMinLength - 1}
    characters.`,
    maxlength: `First name cannot be longer than ${this.nameMaxLength}
    characters.`,
  };
  firstNameMessage = this.firstNameValidationMessages['required'];

  private readonly lastNameValidationMessages = {
    required: 'Please enter your last name.',
    minlength: `Last name must be longer than ${this.nameMinLength - 1}
    characters.`,
    maxlength: `Last name cannot be longer than ${this.nameMaxLength}
    characters.`,
  };
  lastNameMessage = this.lastNameValidationMessages['required'];

  private readonly phonePattern = /(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/g;
  private readonly phoneValidationMessages = {
    required: 'Please enter your phone number.',
    pattern: 'Please enter a valid phone number.',
  };
  phoneMessage = this.phoneValidationMessages['required'];

  private readonly emailValidationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address. ie. fake@1234.com',
  };
  emailMessage = this.emailValidationMessages['required'];

  private readonly confirmEmailValidationMessages = {
    required: 'Please confirm your email address.',
  };
  confirmEmailMessage = this.confirmEmailValidationMessages['required'];

  private readonly contactValidationMessages = {
    match: 'The confirmation does not match your email address.',
  };
  contactMessage = this.contactValidationMessages['match'];

  private readonly passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      contactGroup: this.fb.group(
        {
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
          phone: [
            '',
            [Validators.required, Validators.pattern(this.phonePattern)],
          ],
          email: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', Validators.required],
        },
        { validator: emailMatcher }
      ),
      passwordGroup: this.fb.group(
        {
          password: [
            '',
            [Validators.required, Validators.pattern(this.passwordPattern)],
          ],
          confirmPassword: ['', [Validators.required]],
          showPassword: false,
        },
        { validator: passwordMatcher }
      ),
    });
  }
}
