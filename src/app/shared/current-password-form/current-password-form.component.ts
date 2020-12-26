import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ctacu-current-password-form',
  templateUrl: './current-password-form.component.html',
  styleUrls: ['./current-password-form.component.scss'],
})
export class CurrentPasswordFormComponent implements OnInit, OnDestroy {
  readonly pageTitle = 'Current Password';
  showPassword = false;
  private readonly subscriptions: Subscription[] = [];

  @Input() parentForm: FormGroup;
  @Input() submitted: boolean;
  @Input() invalidPasswordMessage: string;

  @Output() onValueChange = new EventEmitter<string>();

  private readonly currentPasswordValidationMessages = {
    required: 'Please confirm your current password.',
  };
  currentPasswordMessage = this.currentPasswordValidationMessages['required'];

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
    this.currentPasswordMessage = '';
    if (c.errors) {
      this.onValueChange.emit('');
      this.currentPasswordMessage = Object.keys(c.errors)
        .map((key) => this.currentPasswordValidationMessages[key])
        .join(' ');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
