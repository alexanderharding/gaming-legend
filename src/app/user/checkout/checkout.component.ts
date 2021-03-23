import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, first, map } from 'rxjs/operators';

import { CartService } from 'src/app/core/cart.service';
import { NotificationService } from 'src/app/core/notification.service';
import { OrderService } from 'src/app/services/order.service';
import { ShippingRateService } from 'src/app/user/shipping-rate.service';
import { ICartItem } from 'src/app/types/cart-item';
import { Customer, CustomerMaker } from 'src/app/types/customer';
import { INotification } from 'src/app/types/notification';
import { Order, OrderMaker } from 'src/app/types/order';
import { Payment, PaymentMaker } from 'src/app/types/payment';
import { ShippingRatesResult } from 'src/app/types/shipping-rates-result';

function cardNumberChecker(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const value = c.value?.toString() as string;

  if (!value) {
    return null;
  }

  const visa = /^4[0-9]{12}(?:[0-9]{3})?$/.test(value);
  const mastercard = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/.test(
    value
  );
  const amex = /^3[47][0-9]{13}$/.test(value);
  const discover = /^6(?:011\d{12}|5\d{14}|4[4-9]\d{13}|22(?:1(?:2[6-9]|[3-9]\d)|[2-8]\d{2}|9(?:[01]\d|2[0-5]))\d{10})$/.test(
    value
  );
  const dinersClub = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(value);
  const carteBlanche = /^389[0-9]{11}$/.test(value);
  const jcb = /^(?:2131|1800|35\d{3})\d{11}/.test(value);
  const unionPay = /^(62[0-9]{14,17})$/.test(value);
  const bcGlobal = /^(6541|6556)[0-9]{12}/.test(value);
  const maestro = /^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$/.test(
    value
  );

  const valid =
    visa ||
    amex ||
    mastercard ||
    discover ||
    dinersClub ||
    carteBlanche ||
    jcb ||
    unionPay ||
    bcGlobal ||
    maestro;

  if (valid) {
    return null;
  }

  return { cardNumber: true };
}

@Component({
  templateUrl: './checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent implements OnInit, OnDestroy {
  /* Get data from resolver */
  private readonly resolvedData = this.route.snapshot.data
    .resolvedData as ShippingRatesResult;
  readonly shippingRates = this.resolvedData.shippingRates;
  readonly errorMessage = this.resolvedData.error;

  private readonly date = new Date();
  private readonly month = this.date.getMonth();
  private readonly fullYear = this.date.getFullYear();
  readonly cardMinExpiration = `${this.fullYear}-0${this.month + 1}`;
  readonly cardMaxExpiration = `${this.fullYear + 8}-0${this.month + 1}`;

  pageTitle = this.shippingRates ? 'Checkout' : 'Retrieval Error';
  pageTitleTextClass = this.shippingRates ? 'text-light' : 'text-danger';

  private readonly subscriptions: Subscription[] = [];

  submitted = false;
  orderPlaced = false;

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  /* Main FormGroup */
  checkOutForm: FormGroup;

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
  private readonly zipPattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
  private readonly cvvPattern = /^[0-9]{3,4}$/;
  private readonly phonePattern = /^(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})$/;

  private readonly firstNameValidationMessages = {
    required: 'Please enter your first name.',
  };
  private readonly firstNameMessageSubject = new BehaviorSubject<string>(
    this.firstNameValidationMessages.required
  );
  readonly firstNameMessage$ = this.firstNameMessageSubject.asObservable();

  private readonly lastNameValidationMessages = {
    required: 'Please enter your last name.',
  };
  private readonly lastNameMessageSubject = new BehaviorSubject<string>(
    this.lastNameValidationMessages.required
  );
  readonly lastNameMessage$ = this.lastNameMessageSubject.asObservable();

  private readonly streetValidationMessages = {
    required: 'Please enter your street.',
  };
  private readonly streetMessageSubject = new BehaviorSubject<string>(
    this.streetValidationMessages.required
  );
  readonly streetMessage$ = this.streetMessageSubject.asObservable();

  private readonly cityValidationMessages = {
    required: 'Please enter your city.',
  };
  private readonly cityMessageSubject = new BehaviorSubject<string>(
    this.cityValidationMessages.required
  );
  readonly cityMessage$ = this.cityMessageSubject.asObservable();

  private readonly stateValidationMessages = {
    required: 'Please select your state.',
  };
  private readonly stateMessageSubject = new BehaviorSubject<string>(
    this.stateValidationMessages.required
  );
  readonly stateMessage$ = this.stateMessageSubject.asObservable();

  private readonly zipValidationMessages = {
    required: 'Please enter your zip code.',
    pattern: 'Please enter a valid zip code.',
  };
  private readonly zipMessageSubject = new BehaviorSubject<string>(
    this.zipValidationMessages.required
  );
  readonly zipMessage$ = this.zipMessageSubject.asObservable();

  private readonly countryValidationMessages = {
    required: 'Please select your country.',
  };
  private readonly countryMessageSubject = new BehaviorSubject<string>(
    this.countryValidationMessages.required
  );
  readonly countryMessage$ = this.countryMessageSubject.asObservable();

  private readonly phoneValidationMessages = {
    required: 'Please enter your phone number.',
    pattern: 'Please enter a valid phone number.',
  };
  private readonly phoneMessageSubject = new BehaviorSubject<string>(
    this.phoneValidationMessages.required
  );
  readonly phoneMessage$ = this.phoneMessageSubject.asObservable();

  private readonly emailValidationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.',
  };
  private readonly emailMessageSubject = new BehaviorSubject<string>(
    this.emailValidationMessages.required
  );
  readonly emailMessage$ = this.emailMessageSubject.asObservable();

  private readonly cardNumberValidationMessages = {
    required: 'Please enter your card number.',
    cardNumber: 'Please enter a valid card number.',
  };
  private readonly cardNumberMessageSubject = new BehaviorSubject<string>(
    this.cardNumberValidationMessages.required
  );
  readonly cardNumberMessage$ = this.cardNumberMessageSubject.asObservable();

  private readonly expirationValidationMessages = {
    required: `Please enter your card expiration.`,
  };
  private readonly expirationMessageSubject = new BehaviorSubject<string>(
    this.expirationValidationMessages.required
  );
  readonly expirationMessage$ = this.expirationMessageSubject.asObservable();

  private readonly cvvValidationMessages = {
    required: `Please enter your card CVC.`,
    pattern: 'Please enter a valid CVC.',
  };
  private readonly cvvMessageSubject = new BehaviorSubject<string>(
    this.cvvValidationMessages.required
  );
  readonly cvvMessage$ = this.cvvMessageSubject.asObservable();

  constructor(
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly shippingRateService: ShippingRateService,
    private readonly notificationService: NotificationService,
    private readonly title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle(`Gaming Legend | ${this.pageTitle}`);
    if (this.shippingRates) {
      this.onShippingRatesReceived();
    }
  }

  onSubmit(form: FormGroup): void {
    window.scrollTo(0, 0);
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      this.setLoading(true);
      this.getOrder(form).subscribe({
        next: (order) => this.saveOrder(order, order.items),
        error: () => this.show('Error placing order !', true),
      });
    }
  }

  private onShippingRatesReceived(): void {
    // Build check out form
    this.checkOutForm = this.fb.group({
      nameGroup: this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
      }),
      contactGroup: this.fb.group({
        phone: [
          '',
          [Validators.required, Validators.pattern(this.phonePattern)],
        ],
        email: ['', [Validators.required, Validators.email]],
      }),
      addressGroup: this.fb.group({
        street: ['', [Validators.required]],
        street2: '',
        zip: ['', [Validators.required, Validators.pattern(this.zipPattern)]],
        state: ['', [Validators.required]],
        city: ['', [Validators.required]],
        country: ['', [Validators.required]],
      }),
      paymentGroup: this.fb.group({
        cardNumber: [null, [Validators.required, cardNumberChecker]],
        expiration: ['', [Validators.required]],
        cvv: [null, [Validators.required, Validators.pattern(this.cvvPattern)]],
      }),
    });
    this.subscribeToControls(this.checkOutForm);
  }

  private subscribeToControls(form: FormGroup): void {
    const firstNameControl = form.get('nameGroup.firstName');
    this.subscriptions.push(
      firstNameControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(firstNameControl, 'firstName'))
    );
    const lastNameControl = form.get('nameGroup.lastName');
    this.subscriptions.push(
      lastNameControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(lastNameControl, 'lastName'))
    );
    const streetControl = form.get('addressGroup.street');
    this.subscriptions.push(
      streetControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(streetControl, 'street'))
    );
    const cityControl = form.get('addressGroup.city');
    this.subscriptions.push(
      cityControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(cityControl, 'city'))
    );
    const stateControl = form.get('addressGroup.state');
    this.subscriptions.push(
      stateControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(stateControl, 'state'))
    );
    const zipControl = form.get('addressGroup.zip');
    this.subscriptions.push(
      zipControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(zipControl, 'zip'))
    );
    const countryControl = form.get('addressGroup.country');
    this.subscriptions.push(
      countryControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(countryControl, 'country'))
    );
    const phoneControl = form.get('contactGroup.phone');
    this.subscriptions.push(
      phoneControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(phoneControl, 'phone'))
    );
    const emailControl = form.get('contactGroup.email');
    this.subscriptions.push(
      emailControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(emailControl, 'email'))
    );
    const cardNumberControl = form.get('paymentGroup.cardNumber');
    this.subscriptions.push(
      cardNumberControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(cardNumberControl, 'cardNumber'))
    );
    const expirationControl = form.get('paymentGroup.expiration');
    this.subscriptions.push(
      expirationControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(expirationControl, 'expiration'))
    );
    const cvvControl = form.get('paymentGroup.cvv');
    this.subscriptions.push(
      cvvControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(cvvControl, 'cvv'))
    );
  }

  private setLoading(value: boolean): void {
    this.loadingSubject.next(value);
    this.setFormState(this.checkOutForm, value);
  }

  private setFormState(form: FormGroup, value: boolean): void {
    value
      ? form.disable({ emitEvent: false })
      : form.enable({ emitEvent: false });
  }

  private show(text: string, danger: boolean): void {
    const notification = {
      textOrTpl: text,
      className: danger ? 'bg-danger text-light' : 'bg-success text-light',
      delay: danger ? 15000 : 10000,
    } as INotification;
    this.notificationService.show(notification);
  }

  private getOrder(form: FormGroup): Observable<Order> {
    return combineLatest([
      this.cartService.subtotal$,
      this.shippingRateService.shippingPriceSelectedAction$,
      this.cartService.totalTax$,
      this.cartService.total$,
      this.cartService.cartItems$,
    ]).pipe(
      first(),
      map(([subtotal, shipping, totalTax, total, items]) => {
        const customer = CustomerMaker.create({
          firstName: form.get('nameGroup.firstName').value as string,
          lastName: form.get('nameGroup.lastName').value as string,
          phone: form.get('contactGroup.phone').value as string,
          email: form.get('contactGroup.email').value as string,
          street: form.get('addressGroup.street').value as string,
          street2: form.get('addressGroup.street2').value as string,
          city: form.get('addressGroup.city').value as string,
          state: form.get('addressGroup.state').value as string,
          zip: form.get('addressGroup.zip').value as string,
          country: form.get('addressGroup.country').value as string,
        }) as Customer;
        const payment = PaymentMaker.create({
          cardNumber: +form.get('paymentGroup.cardNumber').value,
          cvv: +form.get('paymentGroup.cvv').value,
          expiration: form.get('paymentGroup.expiration').value as string,
          subtotal,
          tax: +totalTax,
          shipping,
          total,
        }) as Payment;
        return OrderMaker.create({
          customer,
          items,
          payment,
          date: new Date().toString(),
          status: 'pending',
        }) as Order;
      })
    );
  }

  private saveOrder(order: Order, items: ICartItem[]): void {
    this.orderService.saveOrder(order).subscribe({
      error: () => {
        this.setLoading(false);
        this.show(`Error placing order !`, true);
      },
      complete: () => {
        this.orderPlaced = true;
        this.show(`Order placed !`, false);
        this.router.navigate(['/user', 'order-placed']);
        this.deleteAllItems(items);
      },
    });
  }

  private setMessage(c: AbstractControl, name: string): void {
    let message = '';
    switch (name) {
      case 'firstName':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.firstNameValidationMessages[key])
            .join(' ');
        }
        this.firstNameMessageSubject.next(message);
        break;
      case 'lastName':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.lastNameValidationMessages[key])
            .join(' ');
        }
        this.lastNameMessageSubject.next(message);
        break;
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
      case 'country':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.countryValidationMessages[key])
            .join(' ');
        }
        this.countryMessageSubject.next(message);
        break;
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
      case 'cardNumber':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.cardNumberValidationMessages[key])
            .join(' ');
        }
        this.cardNumberMessageSubject.next(message);
        break;
      case 'expiration':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.expirationValidationMessages[key])
            .join(' ');
        }
        this.expirationMessageSubject.next(message);
        break;
      case 'cvv':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.cvvValidationMessages[key])
            .join(' ');
        }
        this.cvvMessageSubject.next(message);
        break;
      default:
        console.error(`${name} did not match any names.`);
        break;
    }
  }

  private deleteAllItems(items: ICartItem[]): void {
    this.cartService.deleteAllItems(items).subscribe({
      error: () => this.show(`Error emptying cart !`, true),
      complete: () => this.setLoading(false),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
