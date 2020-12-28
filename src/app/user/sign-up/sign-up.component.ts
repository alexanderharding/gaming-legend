import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NgbAccordionConfig,
  NgbProgressbarConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { emailMatcher } from 'src/app/functions/email-matcher';
import { passwordMatcher } from 'src/app/functions/password-matcher';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { IUser, User, UserMaker } from 'src/app/types/user';

@Component({
  selector: 'ctacu-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  submitted = false;
  signUpError: string;
  emailTakenMessage: string;

  @Input() loading: boolean;

  @Output() onSignUp = new EventEmitter<IUser>();
  @Output() loadingChange = new EventEmitter<boolean>();

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
    private readonly accordionConfig: NgbAccordionConfig,
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly progressBarConfig: NgbProgressbarConfig
  ) {
    accordionConfig.closeOthers = true;
    progressBarConfig.striped = true;
    progressBarConfig.animated = true;
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
    this.signUpError = '';
    this.emailTakenMessage = '';
    if (form.valid) {
      this.loadingChange.emit(true);
      const email = form.get('contactGroup.email').value as string;
      this.authService.checkForUser(email).subscribe(
        (result) => {
          if (result) {
            this.loadingChange.emit(false);
            this.emailTakenMessage = `"${email}" is already registered to an
            account.`;
          } else {
            this.signUp(form);
          }
        },
        (error) => {
          this.loadingChange.emit(false);
          this.signUpError = 'There was an error signing up for an account.';
        }
      );
    }
  }

  setEmailTakenMessage(message: string): void {
    this.emailTakenMessage = message;
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
      (result) => this.router.navigate(['/account']),
      (error) => {
        this.loadingChange.emit(false);
        this.signUpError = 'There was an error signing up for an account.';
      }
    );
  }
}
