import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IUser } from 'src/app/types/user';

@Component({
  selector: 'ctacu-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordFormComponent implements OnInit, OnDestroy {
  @Input() parentForm: FormGroup;
  @Input() submitted: boolean;
  @Input() pageTitle: string;
  @Input() user: IUser;

  showPassword = false;

  private readonly passwordValidationMessages = {
    required: 'Please enter a password.',
    pattern: 'Please enter a valid password that is at least 8 characters.',
  };
  private readonly passwordMessageSubject = new BehaviorSubject<string>(
    this.passwordValidationMessages['required']
  );
  readonly passwordMessage$ = this.passwordMessageSubject.asObservable();

  private readonly confirmPasswordValidationMessages = {
    required: 'Please confirm the password.',
  };
  private readonly confirmPasswordMessageSubject = new BehaviorSubject<string>(
    this.confirmPasswordValidationMessages['required']
  );
  readonly confirmPasswordMessage$ = this.confirmPasswordMessageSubject.asObservable();

  private readonly passwordGroupValidationMessages = {
    match: 'The confirmation does not match the password.',
  };
  private readonly passwordGroupMessageSubject = new BehaviorSubject<string>(
    this.passwordGroupValidationMessages['match']
  );
  readonly passwordGroupMessage$ = this.passwordGroupMessageSubject.asObservable();

  private readonly subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    this.subscribeToControls();
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  private subscribeToControls(): void {
    const passwordControl = this.parentForm.get('passwordGroup.password');
    this.subscriptions.push(
      passwordControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(passwordControl, 'password'))
    );
    const confirmPasswordControl = this.parentForm.get(
      'passwordGroup.confirmPassword'
    );
    this.subscriptions.push(
      confirmPasswordControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() =>
          this.setMessage(confirmPasswordControl, 'confirmPassword')
        )
    );
    const passwordGroupControl = this.parentForm.get('passwordGroup');
    this.subscriptions.push(
      passwordGroupControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(passwordGroupControl, 'passwordGroup'))
    );
  }

  private setMessage(c: AbstractControl, name: string): void {
    let message = '';
    switch (name) {
      case 'password':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.passwordValidationMessages[key])
            .join(' ');
        }
        this.passwordMessageSubject.next(message);
        break;
      case 'confirmPassword':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.confirmPasswordValidationMessages[key])
            .join(' ');
        }
        this.confirmPasswordMessageSubject.next(message);
        break;
      case 'passwordGroup':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.passwordGroupValidationMessages[key])
            .join(' ');
        }
        this.passwordGroupMessageSubject.next(message);
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
