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

import { FormService } from 'src/app/services/form.service';
import { IUser } from 'src/app/types/user';

import { UserAddress } from 'src/app/types/user-address';

@Component({
  selector: 'ctacu-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent implements OnInit, OnDestroy {
  readonly defaultPageTitle = 'Address';
  readonly stateOptions = [
    'Alabama',
    'Alaska',
    'American Samoa',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'District of Columbia',
    'Federated States of Micronesia',
    'Florida',
    'Georgia',
    'Guam',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Marshall Islands',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Northern Mariana Islands',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Palau',
    'Pennsylvania',
    'Puerto Rico',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virgin Island',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ];

  @Input() parentForm: FormGroup;
  @Input() submitted: boolean;
  @Input() pageTitle: string;
  @Input() user: IUser;

  private readonly streetMinLength = +this.formService.streetMinLength;
  private readonly streetMaxLength = +this.formService.streetMaxLength;
  private readonly cityMinLength = +this.formService.cityMinLength;
  private readonly cityMaxLength = +this.formService.cityMaxLength;

  private readonly streetValidationMessages = {
    required: 'Please enter your street address.',
    minlength: `The street must be longer than ${this.streetMinLength - 1}
    characters.`,
    maxlength: `The street cannot be longer than ${this.streetMaxLength}
    characters.`,
  };
  private readonly streetMessageSubject = new BehaviorSubject<string>(
    this.streetValidationMessages.required
  );
  readonly streetMessage$ = this.streetMessageSubject.asObservable();

  private readonly cityValidationMessages = {
    required: 'Please enter a city.',
    minlength: `The city must be longer than ${this.cityMinLength - 1}
    characters.`,
    maxlength: `The city cannot be longer than ${this.cityMaxLength}
    characters.`,
  };
  private readonly cityMessageSubject = new BehaviorSubject<string>(
    this.cityValidationMessages.required
  );
  readonly cityMessage$ = this.cityMessageSubject.asObservable();

  private readonly stateValidationMessages = {
    required: 'Please select a state.',
  };
  private readonly stateMessageSubject = new BehaviorSubject<string>(
    this.stateValidationMessages.required
  );
  readonly stateMessage$ = this.stateMessageSubject.asObservable();

  private readonly zipValidationMessages = {
    required: 'Please enter a zip code.',
    pattern: 'Please enter a valid zip code.',
  };
  private readonly zipMessageSubject = new BehaviorSubject<string>(
    this.zipValidationMessages.required
  );
  readonly zipMessage$ = this.zipMessageSubject.asObservable();

  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly formService: FormService) {}

  ngOnInit(): void {
    this.subscribeToControls();
    if (this.user) {
      if (this.user.address) {
        this.setUserAddress(this.user.address);
      }
    }
  }

  private subscribeToControls(): void {
    const streetControl = this.parentForm.get('addressGroup.street');
    this.subscriptions.push(
      streetControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(streetControl, 'street'))
    );
    const cityControl = this.parentForm.get('addressGroup.city');
    this.subscriptions.push(
      cityControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(cityControl, 'city'))
    );
    const stateControl = this.parentForm.get('addressGroup.state');
    this.subscriptions.push(
      stateControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(stateControl, 'state'))
    );
    const zipControl = this.parentForm.get('addressGroup.zip');
    this.subscriptions.push(
      zipControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(zipControl, 'zip'))
    );
  }

  private setMessage(c: AbstractControl, name: string): void {
    let message = '';
    switch (name) {
      case 'street':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.streetValidationMessages[key])
            .join(' ');
        }
        this.streetMessageSubject.next(message);
        break;
      case 'city':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.cityValidationMessages[key])
            .join(' ');
        }
        this.cityMessageSubject.next(message);
        break;
      case 'state':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.stateValidationMessages[key])
            .join(' ');
        }
        this.stateMessageSubject.next(message);
        break;
      case 'zip':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.zipValidationMessages[key])
            .join(' ');
        }
        this.zipMessageSubject.next(message);
        break;
      default:
        console.error(`${name} did not match any names.`);
        break;
    }
  }

  private setUserAddress(address: UserAddress): void {
    const addressControl = this.parentForm.get('addressGroup');
    addressControl.patchValue({
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
