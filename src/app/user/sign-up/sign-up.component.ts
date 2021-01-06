import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NgbAccordionConfig,
  NgbProgressbarConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { emailMatcher } from 'src/app/functions/email-matcher';
import { passwordMatcher } from 'src/app/functions/password-matcher';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { IUser, User, UserMaker } from 'src/app/types/user';
import { UserAddress, UserAddressMaker } from 'src/app/types/user-address';
import { UserContact, UserContactMaker } from 'src/app/types/user-contact';
import { UserName, UserNameMaker } from 'src/app/types/user-name';

@Component({
  selector: 'ctacu-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  private readonly states = this.formValidationRuleService.states;
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
    this.setEmailTakenMessage('');
    if (form.valid) {
      this.loadingChange.emit(true);
      this.checkForUser(form);
    }
  }

  setEmailTakenMessage(message: string): void {
    this.emailTakenMessage = message;
  }

  saveTestUser(value: boolean): void {
    // this.loadingChange.emit(true);
    // const user = UserMaker.create({
    //   firstName: 'Test',
    //   lastName: 'Test',
    //   phone: `${this.getRandomNumber(1000000000, 9999999999)}`,
    //   email: `testemail${this.getRandomNumber(1, 9999)}@test.com`,
    //   street: `${this.getRandomNumber(1, 999)} Test Street`,
    //   city: 'Test City',
    //   state: `${this.states[this.getRandomNumber(0, this.states.length)]}`,
    //   zip: `${this.getRandomNumber(10000, 99999)}`,
    //   country: 'USA',
    //   password: `TestPassword${this.getRandomNumber(1, 999)}`,
    //   isAdmin: value,
    // }) as User;
    // this.checkForUser(user.email).subscribe(
    //   (result) => {
    //     if (result) {
    //       this.loadingChange.emit(false);
    //       return;
    //     }
    //     this.saveUser(user);
    //   },
    //   (error) => {
    //     this.loadingChange.emit(false);
    //     this.signUpError = 'There was an error signing up for an account.';
    //   }
    // );
  }

  private getRandomNumber(min: number, max: number): number {
    return +(Math.floor(Math.random() * (max - min)) + min).toFixed();
  }

  private checkForUser(form: FormGroup): void {
    const emailControl = form.get('contactGroup.email');
    this.authService.checkForUser(emailControl.value).subscribe(
      (result) => {
        if (result) {
          this.loadingChange.emit(false);
          this.setEmailTakenMessage(`"${emailControl.value}" is already
              registered to an account.`);
        } else {
          this.saveUser(form);
        }
      },
      (error) => {
        this.loadingChange.emit(false);
        this.signUpError = 'There was an error signing up for an account.';
      }
    );
  }

  private saveUser(form: FormGroup): void {
    const user = UserMaker.create({
      name: UserNameMaker.create({
        firstName: form.get('nameGroup.firstName').value as string,
        lastName: form.get('nameGroup.lastName').value as string,
      } as UserName),
      contact: UserContactMaker.create({
        phone: form.get('contactGroup.phone').value as string,
        email: form.get('contactGroup.email').value as string,
      } as UserContact),
      password: form.get('passwordGroup.password').value as string,
      isAdmin: false,
    }) as User;
    this.authService.saveUser(user).subscribe(
      (result) => {
        this.loadingChange.emit(false);
        this.router.navigate(['/account']);
      },
      (error) => {
        this.loadingChange.emit(false);
        this.signUpError = 'There was an error signing up for an account.';
      }
    );
  }
}
