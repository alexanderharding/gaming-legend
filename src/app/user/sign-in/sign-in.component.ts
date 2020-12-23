import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/types/user';

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  submitted = false;
  signInForm: FormGroup;
  signInMessage: string;
  signInError: string;

  loading = false;

  private returnLink = this.route.snapshot.queryParamMap.get('returnLink');

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
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      showPassword: false,
    });
    const emailControl = this.signInForm.get('email');
    this.subscriptions.push(
      emailControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(emailControl, 'email'))
    );
    const passwordControl = this.signInForm.get('password');
    this.subscriptions.push(
      passwordControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(passwordControl, 'password'))
    );
    this.populateTestData();
  }

  onSubmit(form: FormGroup): void {
    this.signInMessage = '';
    this.signInError = '';
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      this.loading = true;
      const email = form.get('email').value as string;
      const password = form.get('password').value as string;
      this.signIn(email, password);
    }
  }

  signIn(email: string, password: string): void {
    this.authService.signIn(email, password).subscribe(
      (result) => {
        this.loading = false;
        if (result) {
          if (this.returnLink) {
            this.router.navigate([`/${this.returnLink}`]);
            return;
          }
          this.router.navigate(['/account']);
          return;
        }
        this.signInMessage = 'Invalid email or password.';
      },
      (error) => {
        this.loading = false;
        console.error(error);
        this.signInError = 'There was an error signing in.';
      }
    );
  }

  userSignIn(user: IUser): void {
    this.signIn(user.email, user.password);
  }

  setLoading(value: boolean): void {
    this.loading = value;
  }

  private populateTestData(): void {
    this.signInForm.patchValue({
      email: 'test@test.com',
      password: 'TestPassword1234',
    });
  }

  private setMessage(c: AbstractControl, name: string): void {
    this.signInMessage = '';
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
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
