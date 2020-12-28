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
import { IUser } from 'src/app/types/user';

@Component({
  selector: 'ctacu-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit, OnDestroy {
  readonly defaultPageTitle = 'Contact Information';

  @Input() parentForm: FormGroup;
  @Input() submitted: boolean;
  @Input() user: IUser;
  @Input() pageTitle: string;
  @Input() emailTakenMessage: string;

  @Output() onValueChange = new EventEmitter<string>();

  private readonly phoneValidationMessages = {
    required: 'Please enter a phone number.',
    pattern: 'Please enter a valid phone number.',
  };
  phoneMessage = this.phoneValidationMessages['required'];

  private readonly emailValidationMessages = {
    required: 'Please enter an email address.',
    email: 'Please enter a valid email address. ie. fake@1234.com',
  };
  emailMessage = this.emailValidationMessages['required'];

  private readonly confirmEmailValidationMessages = {
    required: 'Please confirm the email address.',
  };
  confirmEmailMessage = this.confirmEmailValidationMessages['required'];

  private readonly contactValidationMessages = {
    match: 'The confirmation does not match the email address.',
  };
  contactGroupMessage = this.contactValidationMessages['match'];

  private readonly subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    this.subscribeToControls();
    if (this.user) {
      this.setUserData(this.user);
    }
  }

  private subscribeToControls(): void {
    const phoneControl = this.parentForm.get('contactGroup.phone');
    this.subscriptions.push(
      phoneControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(phoneControl, 'phone'))
    );
    const emailControl = this.parentForm.get('contactGroup.email');
    this.subscriptions.push(
      emailControl.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
        this.onValueChange.emit('');
        this.setMessage(emailControl, 'email');
      })
    );
    const confirmEmailControl = this.parentForm.get(
      'contactGroup.confirmEmail'
    );
    this.subscriptions.push(
      confirmEmailControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(confirmEmailControl, 'confirmEmail'))
    );
    const contactGroupControl = this.parentForm.get('contactGroup');
    this.subscriptions.push(
      contactGroupControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(contactGroupControl, 'contactGroup'))
    );
  }

  private setMessage(c: AbstractControl, name: string): void {
    switch (name) {
      case 'phone':
        this.phoneMessage = '';
        if (c.errors) {
          this.phoneMessage = Object.keys(c.errors)
            .map((key) => this.phoneValidationMessages[key])
            .join(' ');
        }
        break;
      case 'email':
        this.emailMessage = '';
        if (c.errors) {
          this.emailMessage = Object.keys(c.errors)
            .map((key) => this.emailValidationMessages[key])
            .join(' ');
        }
        break;
      case 'confirmEmail':
        this.confirmEmailMessage = '';
        if (c.errors) {
          this.confirmEmailMessage = Object.keys(c.errors)
            .map((key) => this.confirmEmailValidationMessages[key])
            .join(' ');
        }
        break;
      case 'contactGroup':
        this.contactGroupMessage = '';
        if (c.errors) {
          this.contactGroupMessage = Object.keys(c.errors)
            .map((key) => this.contactValidationMessages[key])
            .join(' ');
        }
        break;
      default:
        console.error(`${name} did not match any names.`);
        break;
    }
  }

  private setUserData(user: IUser): void {
    this.parentForm.patchValue({
      contactGroup: {
        phone: user.phone,
        email: user.email,
        confirmEmail: user.email,
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
