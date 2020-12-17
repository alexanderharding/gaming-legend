import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  submitted = false;
  signInForm: FormGroup;
  signInMessage: string;

  private readonly emailValidationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address',
  };
  emailMessage = this.emailValidationMessages['required'];

  private readonly passwordValidationMessages = {
    required: 'Please enter your password.',
  };
  passwordMessage = this.passwordValidationMessages['required'];

  constructor(
    private readonly authService: AuthService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      showPassword: false,
    });
    const emailControl = this.signInForm.get('email');
    emailControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => this.setMessage(emailControl, 'email'));
    const passwordControl = this.signInForm.get('password');
    passwordControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => this.setMessage(passwordControl, 'password'));
    this.populateTestData();
  }

  signIn(form: FormGroup): void {
    this.signInMessage = '';
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      const email = form.get('email').value as string;
      const password = form.get('password').value as string;
      this.authService.signIn(email, password).subscribe(
        (result) => {
          if (result) {
            return;
          }
          this.signInMessage = 'Invalid email or password.';
        },
        (error) => console.error(error)
      );
    }
  }

  private populateTestData(): void {
    this.signInForm.patchValue({
      email: 'test@test.com',
      password: 'TestPassword1234',
    });
  }

  private setMessage(c: AbstractControl, name: string): void {
    switch (name) {
      case 'email':
        this.emailMessage = '';
        if (c.errors) {
          this.emailMessage = Object.keys(c.errors)
            .map((key) => this.emailValidationMessages[key])
            .join(' ');
        }
        break;
      case 'password':
        this.passwordMessage = '';
        if (c.errors) {
          this.passwordMessage = Object.keys(c.errors)
            .map((key) => this.passwordValidationMessages[key])
            .join(' ');
        }
        break;
      default:
        console.error(`${name} did not match any names.`);
        break;
    }
  }

  ngOnDestroy(): void {
    this.authService.signOut();
  }
}
