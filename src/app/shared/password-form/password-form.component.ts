import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IUser } from 'src/app/types/user';

@Component({
  selector: 'ctacu-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
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
  passwordMessage = this.passwordValidationMessages['required'];

  private readonly confirmPasswordValidationMessages = {
    required: 'Please confirm your password.',
  };
  confirmPasswordMessage = this.confirmPasswordValidationMessages['required'];

  private readonly passwordGroupValidationMessages = {
    match: 'The confirmation does not match the password.',
  };
  passwordGroupMessage = this.passwordGroupValidationMessages['match'];

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
    switch (name) {
      case 'password':
        this.passwordMessage = '';
        if (c.errors) {
          this.passwordMessage = Object.keys(c.errors)
            .map((key) => this.passwordValidationMessages[key])
            .join(' ');
        }
        break;
      case 'confirmPassword':
        this.confirmPasswordMessage = '';
        if (c.errors) {
          this.confirmPasswordMessage = Object.keys(c.errors)
            .map((key) => this.confirmPasswordValidationMessages[key])
            .join(' ');
        }
        break;
      case 'passwordGroup':
        this.passwordGroupMessage = '';
        if (c.errors) {
          this.passwordGroupMessage = Object.keys(c.errors)
            .map((key) => this.passwordGroupValidationMessages[key])
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
