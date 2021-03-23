import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime, first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/notification.service';
import { INotification } from 'src/app/types/notification';

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit, OnDestroy {
  // pageTitle = 'sign in';
  // users$ = this.authService.users$;
  // submitted = false;
  // signInForm: FormGroup;
  // signInMessage = '';
  // @ViewChild('successTpl') private successTpl: TemplateRef<any>;
  // @ViewChild('dangerTpl') private dangerTpl: TemplateRef<any>;
  // private readonly subscriptions: Subscription[] = [];
  // private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  // readonly loading$ = this.loadingSubject.asObservable();

  // private readonly emailValidationMessages = {
  //   required: 'Please enter your email address.',
  //   email: 'Please enter a valid email address',
  // };
  // private readonly emailMessageSubject = new BehaviorSubject<string>(
  //   this.emailValidationMessages.required
  // );
  // readonly emailMessage$ = this.emailMessageSubject.asObservable();

  // private readonly passwordValidationMessages = {
  //   required: 'Please enter your password.',
  // };
  // private readonly passwordMessageSubject = new BehaviorSubject<string>(
  //   this.passwordValidationMessages.required
  // );
  // readonly passwordMessage$ = this.passwordMessageSubject.asObservable();

  constructor() // private readonly fb: FormBuilder, // private readonly authService: AuthService,
  // private readonly router: Router,
  // private readonly notificationService: NotificationService
  {}

  ngOnInit(): void {
    // this.signInForm = this.fb.group({
    //   email: ['', [Validators.required, Validators.email]],
    //   password: ['', [Validators.required]],
    //   showPassword: false,
    //   user: null,
    // });
    // const emailControl = this.signInForm.get('email');
    // this.subscriptions.push(
    //   emailControl.valueChanges
    //     .pipe(debounceTime(1000))
    //     .subscribe(() => this.setMessage(emailControl, 'email'))
    // );
    // const passwordControl = this.signInForm.get('password');
    // this.subscriptions.push(
    //   passwordControl.valueChanges
    //     .pipe(debounceTime(1000))
    //     .subscribe(() => this.setMessage(passwordControl, 'password'))
    // );
    // const userControl = this.signInForm.get('user');
    // this.subscriptions.push(
    //   userControl.valueChanges.subscribe((index: number) =>
    //     this.setUserData(+index)
    //   )
    // );
  }

  // onSubmit(form: FormGroup): void {
  //   this.signInMessage = '';
  //   if (!this.submitted) {
  //     this.submitted = true;
  //   }
  //   if (form.valid) {
  //     this.setLoading(true);
  //     const email = form.get('email').value as string;
  //     const password = form.get('password').value as string;
  //     this.signIn(email, password);
  //   }
  // }

  // signIn(email: string, password: string): void {
  //   this.authService.signIn(email, password).subscribe(
  //     (result) => {
  //       if (result) {
  //         this.show(this.successTpl, 'bg-success text-light', 10000);
  //         this.setLoading(false);
  //         this.router.navigate(['/account']);
  //         return;
  //       }
  //       this.signInMessage = 'Invalid email or password.';
  //     },
  //     (error) => {
  //       this.show(this.dangerTpl, 'bg-danger text-light', 10000);
  //       this.setLoading(false);
  //     }
  //   );
  // }

  // setLoading(value: boolean): void {
  //   this.loadingSubject.next(value);
  // }

  // private show(
  //   textOrTpl: string | TemplateRef<any>,
  //   className: string,
  //   delay?: number
  // ) {
  //   const notification = {
  //     textOrTpl,
  //     className,
  //     delay,
  //   } as INotification;
  //   this.notificationService.show(notification);
  // }

  // private populateTestData(): void {
  //   this.signInForm.patchValue({
  //     email: 'test@test.com',
  //     password: 'TestPassword1234',
  //   });
  // }

  // private setUserData(index: number): void {
  //   this.users$.pipe(first()).subscribe((users) => {
  //     this.signInForm.patchValue({
  //       email: users[index].contact.email,
  //       password: users[index].password,
  //     });
  //   });
  // }

  // private setMessage(c: AbstractControl, name: string): void {
  //   let message = '';
  //   this.signInMessage = '';
  //   switch (name) {
  //     case 'email':
  //       if (c.errors) {
  //         message = Object.keys(c.errors)
  //           .map((key) => this.emailValidationMessages[key])
  //           .join(' ');
  //       }
  //       this.emailMessageSubject.next(message);
  //       break;
  //     case 'password':
  //       if (c.errors) {
  //         message = Object.keys(c.errors)
  //           .map((key) => this.passwordValidationMessages[key])
  //           .join(' ');
  //       }
  //       this.passwordMessageSubject.next(message);
  //       break;
  //     default:
  //       console.error(`${name} did not match any names.`);
  //       break;
  //   }
  // }

  ngOnDestroy(): void {
    // this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
