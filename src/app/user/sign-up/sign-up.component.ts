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

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            // Validators.minLength(this.nameMinLength),
            // Validators.maxLength(this.nameMaxLength),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            // Validators.minLength(this.nameMinLength),
            // Validators.maxLength(this.nameMaxLength),
          ],
        ],

        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            // Validators.pattern(this.passwordPattern)
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        showPassword: false,
      },
      { validators: [emailMatcher, passwordMatcher] }
    );
  }
}
