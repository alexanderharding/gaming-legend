import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { emailMatcher } from 'src/app/functions/email-matcher';
import { passwordMatcher } from 'src/app/functions/password-matcher';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { User, UserMaker } from 'src/app/types/user';

@Component({
  selector: 'ctacu-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  submitted = false;
  isLoading = false;
  signUpError: string;

  @Output() onSignUp = new EventEmitter<Object>();

  private readonly nameMinLength = +this.formValidationRuleService
    .nameMinLength;
  private readonly nameMaxLength = +this.formValidationRuleService
    .nameMaxLength;
  private readonly phonePattern = this.formValidationRuleService
    .phonePattern as RegExp;
  private readonly passwordPattern = this.formValidationRuleService
    .passwordPattern as RegExp;

  constructor(
    private readonly fb: FormBuilder,
    private readonly config: NgbAccordionConfig,
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly authService: AuthService,
    private readonly router: Router
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
        },
        { validator: passwordMatcher }
      ),
    });
  }

  onSubmit(form: FormGroup): void {
    if (!this.submitted) {
      this.submitted = true;
    }
    // this.errorMessage = '';
    this.signUpError = '';
    if (form.valid) {
      this.isLoading = true;
      const email = form.get('contactGroup.email').value as string;
      this.authService.checkForUser(email).subscribe(
        (result) => {
          if (result) {
            this.isLoading = false;
            this.signUpError = `${email} is already registered to an account.
              Please sign in to continue.`;
          } else {
            this.signUp(form);
          }
        },
        (error) => {
          this.isLoading = false;
          this.signUpError = 'There was an error signing up for an account.';
        }
      );
    }
  }

  private signUp(form: FormGroup): void {
    const user = UserMaker.create({
      firstName: form.get('nameGroup.firstName').value as string,
      lastName: form.get('nameGroup.lastName').value as string,
      phone: form.get('contactGroup.phone').value as string,
      email: form.get('contactGroup.email').value as string,
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      password: form.get('passwordGroup.password').value as string,
      isAdmin: false,
    }) as User;
    this.authService.saveUser(user).subscribe(
      (result) => {
        this.onSignUp.emit({ email: result.email, password: result.password });
        this.authService.signIn(result.email, result.password).subscribe(
          (result) => {
            this.isLoading = false;
            if (result) {
              this.router.navigate(['/account']);
              return;
            }
            //  this.signInMessage = 'Invalid email or password.';
          },
          (error) => {
            this.isLoading = false;
            console.error(error);
          }
        );
      },
      (error) => {
        this.isLoading = false;
        this.signUpError = 'There was an error signing up for an account.';
      }
    );
  }
}
