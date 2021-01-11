import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IUser } from 'src/app/types/user';

import { UserContact } from 'src/app/types/user-contact';

@Component({
  selector: 'ctacu-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private readonly phoneMessageSubject = new BehaviorSubject<string>(
    this.phoneValidationMessages['required']
  );
  readonly phoneMessage$ = this.phoneMessageSubject.asObservable();

  private readonly emailValidationMessages = {
    required: 'Please enter an email address.',
    email: 'Please enter a valid email address. ie. fake@1234.com',
  };
  private readonly emailMessageSubject = new BehaviorSubject<string>(
    this.emailValidationMessages['required']
  );
  readonly emailMessage$ = this.emailMessageSubject.asObservable();

  private readonly confirmEmailValidationMessages = {
    required: 'Please confirm the email address.',
  };
  private readonly confirmEmailMessageSubject = new BehaviorSubject<string>(
    this.confirmEmailValidationMessages['required']
  );
  readonly confirmEmailMessage$ = this.confirmEmailMessageSubject.asObservable();

  private readonly contactGroupValidationMessages = {
    match: 'The confirmation does not match the email address.',
  };
  private readonly contactGroupMessageSubject = new BehaviorSubject<string>(
    this.contactGroupValidationMessages['match']
  );
  readonly contactGroupMessage$ = this.contactGroupMessageSubject.asObservable();

  private readonly subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    this.subscribeToControls();
    if (this.user) {
      this.setUserData(this.user.contact);
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
    let message = '';
    switch (name) {
      case 'phone':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.phoneValidationMessages[key])
            .join(' ');
        }
        this.phoneMessageSubject.next(message);
        break;
      case 'email':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.emailValidationMessages[key])
            .join(' ');
        }
        this.emailMessageSubject.next(message);
        break;
      case 'confirmEmail':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.confirmEmailValidationMessages[key])
            .join(' ');
        }
        this.confirmEmailMessageSubject.next(message);
        break;
      case 'contactGroup':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.contactGroupValidationMessages[key])
            .join(' ');
        }
        this.contactGroupMessageSubject.next(message);
        break;
      default:
        console.error(`${name} did not match any names.`);
        break;
    }
  }

  private setUserData(contact: UserContact): void {
    const contactControl = this.parentForm.get('contactGroup');
    contactControl.setValue({
      phone: contact.phone,
      email: contact.email,
      confirmEmail: contact.email,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
