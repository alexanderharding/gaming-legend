import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';
import { openAnimation } from 'src/app/app.animation';
import { IUser } from 'src/app/types/user';

@Component({
  selector: 'ctacu-contact-panel-content',
  templateUrl: './contact-panel-content.component.html',
  animations: [openAnimation],
})
export class ContactPanelContent implements OnInit {
  @Input() checkOutForm: FormGroup;
  @Input() submitted: boolean;
  @Input() nameMinLength: number;
  @Input() nameMaxLength: number;
  @Input() currentPanelId: number;
  panelId = 0;
  @Input() currentUser$: Observable<IUser>;

  @Output() toggleChange = new EventEmitter<string>();
  @Output() newSubscription = new EventEmitter<Subscription>();

  private firstNameValidationMessages: Object;
  firstNameMessage: string;

  private lastNameValidationMessages: Object;
  lastNameMessage: string;

  private readonly phoneValidationMessages = {
    required: 'Please enter your phone number.',
    pattern: 'Please enter a valid phone number.',
  };
  phoneMessage = this.phoneValidationMessages['required'];

  private readonly emailValidationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address. ie. fake@1234.com',
  };
  emailMessage = this.emailValidationMessages['required'];

  private readonly confirmEmailValidationMessages = {
    required: 'Please confirm your email address.',
  };
  confirmEmailMessage = this.confirmEmailValidationMessages['required'];

  private readonly contactValidationMessages = {
    match: 'The confirmation does not match your email address.',
  };
  contactMessage = this.contactValidationMessages['match'];

  constructor() {}

  ngOnInit(): void {
    this.subToControls();
    this.setNameValidationMessages();
    this.populateTestData();
  }

  togglePanel(panelTitle: string): void {
    this.toggleChange.emit(panelTitle);
  }

  private subToControls(): void {
    const firstNameControl = this.checkOutForm.get('contactGroup.firstName');
    this.newSubscription.emit(
      firstNameControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(firstNameControl, 'firstName'))
    );
    const lastNameControl = this.checkOutForm.get('contactGroup.lastName');
    this.newSubscription.emit(
      lastNameControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(lastNameControl, 'lastName'))
    );
    const phoneControl = this.checkOutForm.get('contactGroup.phone');
    this.newSubscription.emit(
      phoneControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(phoneControl, 'phone'))
    );
    const emailControl = this.checkOutForm.get('contactGroup.email');
    this.newSubscription.emit(
      emailControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(emailControl, 'email'))
    );
    const confirmEmailControl = this.checkOutForm.get(
      'contactGroup.confirmEmail'
    );
    this.newSubscription.emit(
      confirmEmailControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(confirmEmailControl, 'confirmEmail'))
    );
    const contactGroupControl = this.checkOutForm.get('contactGroup');
    this.newSubscription.emit(
      contactGroupControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(contactGroupControl, 'contact'))
    );
    // this.currentUser$.pipe(first()).subscribe((user) => {
    //   if (user) {
    //     this.setUserData(user);
    //   }
    // });
  }

  private setNameValidationMessages(): void {
    this.firstNameValidationMessages = {
      required: 'Please enter your first name.',
      minlength: `First name must be longer than ${this.nameMinLength - 1}
    characters.`,
      maxlength: `First name cannot be longer than ${this.nameMaxLength}
    characters.`,
    };
    this.firstNameMessage = this.firstNameValidationMessages['required'];
    this.lastNameValidationMessages = {
      required: 'Please enter your last name.',
      minlength: `Last name must be longer than ${this.nameMinLength - 1}
    characters.`,
      maxlength: `Last name cannot be longer than ${this.nameMaxLength}
    characters.`,
    };
    this.lastNameMessage = this.lastNameValidationMessages['required'];
  }

  private setMessage(c: AbstractControl, name: string): void {
    switch (name) {
      case 'firstName':
        this.firstNameMessage = '';
        if (c.errors) {
          this.firstNameMessage = Object.keys(c.errors)
            .map((key) => this.firstNameValidationMessages[key])
            .join(' ');
        }
        break;
      case 'lastName':
        this.lastNameMessage = '';
        if (c.errors) {
          this.lastNameMessage = Object.keys(c.errors)
            .map((key) => this.lastNameValidationMessages[key])
            .join(' ');
        }
        break;
      case 'phone':
        this.lastNameMessage = '';
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
      case 'contact':
        this.contactMessage = '';
        if (c.errors) {
          this.contactMessage = Object.keys(c.errors)
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
    this.checkOutForm.patchValue({
      contactGroup: {
        firstName: user.firstName || '',
        phone: user.phone,
        email: user.email,
        confirmEmail: user.email,
      },
    });
  }

  private populateTestData(): void {
    this.checkOutForm.patchValue({
      contactGroup: {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567891',
        email: 'johndoe@fake.com',
        confirmEmail: 'johndoe@fake.com',
      },
    });
  }
}
