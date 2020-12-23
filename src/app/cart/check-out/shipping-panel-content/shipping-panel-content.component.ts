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
import { CartService } from 'src/app/services/cart.service';
import { ShippingRateService } from 'src/app/services/shipping-rate.service';
import { IShippingRate } from 'src/app/types/shipping-rate';
import { IUser } from 'src/app/types/user';

@Component({
  selector: 'ctacu-shipping-panel-content',
  templateUrl: './shipping-panel-content.component.html',
  styleUrls: ['./shipping-panel-content.component.scss'],
})
export class ShippingPanelContentComponent implements OnInit {
  @Input() checkOutForm: FormGroup;
  @Input() submitted: boolean;
  deliveryDate: Date;

  @Input() states: string[];

  @Input() shippingRates: IShippingRate[];
  @Input() user: IUser;

  @Input() streetMinLength: number;
  @Input() streetMaxLength: number;
  @Input() cityMinLength: number;
  @Input() cityMaxLength: number;

  @Output() toggleChange = new EventEmitter<string>();
  @Output() newSubscription = new EventEmitter<Subscription>();

  private streetValidationMessages;
  streetMessage: string;

  private cityValidationMessages;
  cityMessage: string;

  private readonly stateValidationMessages = {
    required: 'Please select your state.',
  };
  stateMessage = this.stateValidationMessages['required'];

  private readonly zipValidationMessages = {
    required: 'Please enter your zip code.',
    pattern: 'Please enter a valid zip code.',
  };
  zipMessage = this.zipValidationMessages['required'];

  constructor(
    private readonly shippingRateService: ShippingRateService,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    this.streetValidationMessages = {
      required: 'Please enter your street address.',
      minlength: `The street must be longer than ${this.streetMinLength - 1}
    characters.`,
      maxlength: `The street cannot be longer than ${this.streetMaxLength}
    characters.`,
    };
    this.streetMessage = this.streetValidationMessages['required'];
    this.cityValidationMessages = {
      required: 'Please enter your city.',
      minlength: `The city must be longer than ${this.cityMinLength - 1}
    characters.`,
      maxlength: `The city cannot be longer than ${this.cityMaxLength}
    characters.`,
    };
    this.cityMessage = this.cityValidationMessages['required'];

    this.subscribeToControls();
    if (this.shippingRates) {
      this.checkOutForm.patchValue({
        shippingRate: +this.shippingRates[0].price,
      });
    }

    if (this.user) {
      this.setUserData(this.user);
    }
    // this.populateTestData();
  }

  togglePanel(panelTitle: string): void {
    this.toggleChange.emit(panelTitle);
  }

  private subscribeToControls(): void {
    const streetControl = this.checkOutForm.get('addressGroup.street');
    this.newSubscription.emit(
      streetControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(streetControl, 'street'))
    );
    const cityControl = this.checkOutForm.get('addressGroup.city');
    this.newSubscription.emit(
      cityControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(cityControl, 'city'))
    );
    const stateControl = this.checkOutForm.get('addressGroup.state');
    this.newSubscription.emit(
      stateControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(stateControl, 'state'))
    );
    const zipControl = this.checkOutForm.get('addressGroup.zip');
    this.newSubscription.emit(
      zipControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(zipControl, 'zip'))
    );
    const shippingRateControl = this.checkOutForm.get('shippingRate');
    this.newSubscription.emit(
      shippingRateControl.valueChanges
        .pipe(debounceTime(500))
        .subscribe((price: number) => {
          this.setDeliveryDate(+price);
          this.cartService.setShipping(+price);
        })
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
    this.checkOutForm.patchValue({
      addressGroup: {
        street: user.street,
        city: user.city,
        state: user.state,
        zip: user.zip,
      },
    });
  }

  private setDeliveryDate(selectedPrice: number): void {
    const totalDays = this.shippingRates.find(
      ({ price }) => price === +selectedPrice
    ).rate;
    this.deliveryDate = this.shippingRateService.getDeliveryDate(totalDays);
  }

  private populateTestData(): void {
    this.checkOutForm.patchValue({
      addressGroup: {
        street: '1234 S Fake Ln',
        city: 'Las Vegas',
        state: 'Nevada',
        // zip: '12347',
      },
    });
  }
}
