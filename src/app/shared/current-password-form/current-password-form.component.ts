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

@Component({
  selector: 'ctacu-current-password-form',
  templateUrl: './current-password-form.component.html',
  styleUrls: ['./current-password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentPasswordFormComponent implements OnInit, OnDestroy {
  readonly pageTitle = 'Current Password';
  showPassword = false;
  private readonly subscriptions: Subscription[] = [];

  @Input() parentForm: FormGroup;
  @Input() submitted: boolean;

  private readonly currentPasswordValidationMessages = {
    required: 'Please confirm your current password.',
    invalid: 'This does not match the password on-file.',
  };
  private readonly currentPasswordMessageSubject = new BehaviorSubject<string>(
    this.currentPasswordValidationMessages['required']
  );
  readonly currentPasswordMessage$ = this.currentPasswordMessageSubject.asObservable();

  constructor() {}

  ngOnInit(): void {
    const currentPasswordControl = this.parentForm.get('currentPassword');
    this.subscriptions.push(
      currentPasswordControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(currentPasswordControl))
    );
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  private setMessage(c: AbstractControl): void {
    this.currentPasswordMessageSubject.next('');
    if (c.errors) {
      const message = Object.keys(c.errors)
        .map((key) => this.currentPasswordValidationMessages[key])
        .join(' ');
      this.currentPasswordMessageSubject.next(message);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
