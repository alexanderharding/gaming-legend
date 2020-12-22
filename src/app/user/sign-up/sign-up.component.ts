import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
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

  // private readonly nameMinLength = 3;
  // private readonly nameMaxLength = 20;

  private readonly phonePattern = /(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/;
  private readonly passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  constructor(
    private readonly fb: FormBuilder,
    private readonly config: NgbAccordionConfig
  ) {
    config.closeOthers = true;
  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      nameGroup: this.fb.group({
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
      }),
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
