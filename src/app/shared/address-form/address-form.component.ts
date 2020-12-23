import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { CheckOutService } from 'src/app/services/check-out.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
import { ShippingRateService } from 'src/app/services/shipping-rate.service';
import { IShippingRate } from 'src/app/types/shipping-rate';
import { IUser } from 'src/app/types/user';

@Component({
  selector: 'ctacu-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent implements OnInit, OnDestroy {
  readonly pageTitle = 'Address';
  readonly states = this.checkOutService.states;

  @Input() parentForm: FormGroup;
  @Input() submitted: boolean;
  @Input() user: IUser;

  private readonly streetMinLength = +this.formValidationRuleService
    .streetMinLength;
  private readonly streetMaxLength = +this.formValidationRuleService
    .streetMaxLength;
  private readonly cityMinLength = +this.formValidationRuleService
    .cityMinLength;
  private readonly cityMaxLength = +this.formValidationRuleService
    .cityMaxLength;

  private streetValidationMessages = {
    required: 'Please enter your street address.',
    minlength: `The street must be longer than ${this.streetMinLength - 1}
    characters.`,
    maxlength: `The street cannot be longer than ${this.streetMaxLength}
    characters.`,
  };
  streetMessage = this.streetValidationMessages['required'];

  private cityValidationMessages = {
    required: 'Please enter your city.',
    minlength: `The city must be longer than ${this.cityMinLength - 1}
    characters.`,
    maxlength: `The city cannot be longer than ${this.cityMaxLength}
    characters.`,
  };
  cityMessage = this.cityValidationMessages['required'];

  private readonly stateValidationMessages = {
    required: 'Please select your state.',
  };
  stateMessage = this.stateValidationMessages['required'];

  private readonly zipValidationMessages = {
    required: 'Please enter your zip code.',
    pattern: 'Please enter a valid zip code.',
  };
  zipMessage = this.zipValidationMessages['required'];

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly checkOutService: CheckOutService
  ) {}

  ngOnInit(): void {
    this.subscribeToControls();
    if (this.user) {
      this.setUserData(this.user);
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
    switch (name) {
      case 'street':
        this.streetMessage = '';
        if (c.errors) {
          this.streetMessage = Object.keys(c.errors)
            .map((key) => this.streetValidationMessages[key])
            .join(' ');
        }
        break;
      case 'city':
        this.cityMessage = '';
        if (c.errors) {
          this.cityMessage = Object.keys(c.errors)
            .map((key) => this.cityValidationMessages[key])
            .join(' ');
        }
        break;
      case 'state':
        this.stateMessage = '';
        if (c.errors) {
          this.stateMessage = Object.keys(c.errors)
            .map((key) => this.stateValidationMessages[key])
            .join(' ');
        }
        break;
      case 'zip':
        this.zipMessage = '';
        if (c.errors) {
          this.zipMessage = Object.keys(c.errors)
            .map((key) => this.zipValidationMessages[key])
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
      addressGroup: {
        street: user.street,
        city: user.city,
        state: user.state,
        zip: user.zip,
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
