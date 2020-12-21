import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { first, tap } from 'rxjs/operators';

import { emailMatcher } from 'src/app/functions/email-matcher';
import { passwordMatcher } from 'src/app/functions/password-matcher';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckOutService } from 'src/app/services/check-out.service';
import { ICartItem } from 'src/app/types/cart-item';
import { Customer, CustomerMaker } from 'src/app/types/customer';
import { Order, OrderMaker } from 'src/app/types/order';
import { Payment, PaymentMaker } from 'src/app/types/payment';
import { IShippingRate } from 'src/app/types/shipping-rate';
import { ShippingRatesResult } from 'src/app/types/shipping-rates-result';
import { IUser, User, UserMaker } from 'src/app/types/user';

function dateChecker(c: AbstractControl): { [key: string]: boolean } | null {
  const monthControl = c.get('expiringMonth');
  const yearControl = c.get('expiringYear');
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  if (monthControl.pristine || yearControl.pristine) {
    return null;
  }

  if (+yearControl.value > currentYear) {
    return null;
  }

  if (+monthControl.value >= currentMonth) {
    return null;
  }

  return { expired: true };
}

function cardNumberChecker(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const value = c.value?.toString() as string;

  if (c.pristine || !value) {
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

// function phoneChecker(c: AbstractControl): { [key: string]: boolean } | null {
//   const value = c.value?.toString() as string;
//   const withinRange = /^\w{10,15}$/.test(value);

//   if (c.pristine || !value || !withinRange) {
//     return null;
//   }

//   const hasOnlyNoLetters = !/[A-Z]/.test(value) && !/[a-z]/.test(value);
//   const hasNumbers = /\d/.test(value);

//   if (hasOnlyNoLetters && hasNumbers) {
//     return null;
//   }
//   return { phone: true };
// }
// function cvvChecker(c: AbstractControl): { [key: string]: boolean } | null {
//   const value = c.value?.toString() as string;
//   const withinRange = /^\w{3,4}$/.test(value);

//   if (c.pristine || !c.value || withinRange) {
//     return null;
//   }

//   return { cvv: true };
// }

// function zipChecker(c: AbstractControl): { [key: string]: boolean } | null {
//   const value = c.value?.toString() as string;
//   const valid = /^[0-9]{5}(?:-[0-9]{4})?$/.test(value);

//   if (c.pristine || !c.value || valid) {
//     return null;
//   }

//   return { zip: true };
// }

@Component({
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
  providers: [NgbAccordionConfig],
})
export class CheckOutComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  currentPanelId = 0;

  user: IUser;

  /* Get data from CartService */
  readonly items$ = this.cartService.cartAction$;
  readonly cartQuantity$ = this.cartService.cartQuantity$;
  readonly subtotal$ = this.cartService.subtotal$;

  /* Get data from CheckOutService */
  readonly states = this.checkOutService.states;

  private total: number;

  /* Get data from resolver */
  private readonly resolvedData = this.route.snapshot.data
    .resolvedData as ShippingRatesResult;
  readonly shippingRates = this.resolvedData.shippingRates as IShippingRate[];
  errorMessage = this.resolvedData.error as string;

  /* Set pageTitle */
  readonly pageTitle = this.shippingRates
    ? ('Check Out' as string)
    : ('Retrieval Error' as string);

  signUpError: string;

  submitted = false;
  orderPlaced = false;
  isLoading = false;

  // Main form group
  checkOutForm: FormGroup;

  // Form control validation messages and validation rules
  readonly nameMinLength = 3;
  readonly nameMaxLength = 20;
  readonly streetMinLength = 5;
  readonly streetMaxLength = 20;
  readonly cityMinLength = 3;
  readonly cityMaxLength = 15;
  private readonly zipPattern = /^[0-9]{5}(?:-[0-9]{4})?$/gm;
  private readonly cvvPattern = /^[0-9]{3,4}$/;
  private readonly phonePattern = /(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/g;
  private readonly passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

  constructor(
    private readonly config: NgbAccordionConfig,
    private readonly cartService: CartService,
    private readonly checkOutService: CheckOutService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {
    config.closeOthers = true;
  }

  ngOnInit(): void {
    // Build check out form
    this.checkOutForm = this.fb.group({
      // nameGroup: this.fb.group({
      //   firstName: [
      //     '',
      //     [
      //       Validators.required,
      //       Validators.minLength(this.nameMinLength),
      //       Validators.maxLength(this.nameMaxLength),
      //     ],
      //   ],
      //   lastName: [
      //     '',
      //     [
      //       Validators.required,
      //       Validators.minLength(this.nameMinLength),
      //       Validators.maxLength(this.nameMaxLength),
      //     ],
      //   ],
      // }),
      contactGroup: this.fb.group(
        {
          firstName: [
            '',
            [
              Validators.required,
              Validators.minLength(this.nameMinLength),
              Validators.maxLength(this.nameMaxLength),
            ],
          ],
          lastName: [
            '',
            [
              Validators.required,
              Validators.minLength(this.nameMinLength),
              Validators.maxLength(this.nameMaxLength),
            ],
          ],
          phone: [
            '',
            [Validators.required, Validators.pattern(this.phonePattern)],
          ],
          email: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', Validators.required],
        },
        { validator: emailMatcher }
      ),
      addressGroup: this.fb.group({
        street: [
          '',
          [
            Validators.required,
            Validators.minLength(this.streetMinLength),
            Validators.maxLength(this.streetMaxLength),
          ],
        ],
        city: [
          '',
          [
            Validators.required,
            Validators.minLength(this.cityMinLength),
            Validators.maxLength(this.cityMaxLength),
          ],
        ],
        state: ['', [Validators.required]],
        zip: ['', [Validators.required, Validators.pattern(this.zipPattern)]],
        country: ['United States', [Validators.required]],
      }),
      shippingRate: null,
      paymentGroup: this.fb.group(
        {
          cardNumber: [null, [Validators.required, cardNumberChecker]],
          cvv: [
            null,
            [Validators.required, Validators.pattern(this.cvvPattern)],
          ],
          expiringMonth: [0, [Validators.required]],
          expiringYear: [0, [Validators.required]],
        },
        { validators: dateChecker }
      ),
      signUpCheck: true,
      signUpGroup: this.fb.group(
        {
          password: [
            '',
            [Validators.required, Validators.pattern(this.passwordPattern)],
          ],
          confirmPassword: ['', [Validators.required]],
          showPassword: false,
        },
        { validator: passwordMatcher }
      ),
    });
    this.authService.currentUser$.pipe(first()).subscribe((user) => {
      if (user) {
        this.user = user as IUser;
      }
    });
  }

  onSubmit(form: FormGroup, items: ICartItem[]): void {
    if (!this.submitted) {
      this.submitted = true;
    }
    this.errorMessage = '';
    this.signUpError = '';
    if (form.valid) {
      this.isLoading = true;
      const signUpCheck = this.checkOutForm.get('signUpCheck').value as boolean;
      if (signUpCheck) {
        const email = this.checkOutForm.get('contactGroup.email')
          .value as string;
        this.authService.checkForUser(email).subscribe(
          (result) => {
            if (result) {
              this.isLoading = false;
              this.signUpError = `${email} is already registered to an account.
              Please sign in to continue.`;
            } else {
              this.signUp(form, items);
            }
          },
          (error) => {
            this.isLoading = false;
            this.signUpError = 'There was an error signing up for an account.';
          }
        );
      } else {
        this.placeOrder(form, items);
      }
    }
  }

  setTotal(total: number): void {
    this.total = total;
  }

  setLoading(value: boolean): void {
    this.isLoading = value;
  }

  setPasswordValidation(value: boolean): void {
    const signUpControl = this.checkOutForm.get('signUpGroup');
    const passwordControl = this.checkOutForm.get('signUpGroup.password');
    const confirmPasswordControl = this.checkOutForm.get(
      'signUpGroup.confirmPassword'
    );
    if (value) {
      signUpControl.setValidators(passwordMatcher);
      passwordControl.setValidators([
        Validators.required,
        Validators.pattern(this.passwordPattern),
      ]);
      confirmPasswordControl.setValidators([Validators.required]);
    } else {
      signUpControl.clearValidators();
      passwordControl.clearValidators();
      confirmPasswordControl.clearValidators();
    }
    signUpControl.updateValueAndValidity();
    passwordControl.updateValueAndValidity();
    confirmPasswordControl.updateValueAndValidity();
  }

  pushSubscription(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }

  changePanelId(id: number): void {
    if (this.currentPanelId === +id) {
      this.currentPanelId = null;
      return;
    }
    this.currentPanelId = +id;
  }

  private signUp(form: FormGroup, items: ICartItem[]): void {
    const user = UserMaker.create({
      firstName: form.get('contactGroup.firstName').value as string,
      lastName: form.get('contactGroup.lastName').value as string,
      phone: form.get('contactGroup.phone').value as string,
      email: form.get('contactGroup.email').value as string,
      street: form.get('addressGroup.street').value as string,
      city: form.get('addressGroup.city').value as string,
      state: form.get('addressGroup.state').value as string,
      zip: form.get('addressGroup.zip').value as string,
      country: form.get('addressGroup.country').value as string,
      password: form.get('signUpGroup.password').value as string,
      isAdmin: false,
    }) as User;
    this.authService.signUp(user).subscribe(
      (result) => this.placeOrder(form, items),
      (error) => {
        this.isLoading = false;
        this.signUpError = 'There was an error signing up for an account.';
      }
    );
  }

  private placeOrder(form: FormGroup, items: ICartItem[]): void {
    const customer = CustomerMaker.create({
      firstName: form.get('contactGroup.firstName').value as string,
      lastName: form.get('contactGroup.lastName').value as string,
      phone: form.get('contactGroup.phone').value,
      email: form.get('contactGroup.email').value as string,
      street: form.get('addressGroup.street').value as string,
      city: form.get('addressGroup.city').value as string,
      state: form.get('addressGroup.state').value as string,
      zip: form.get('addressGroup.zip').value as string,
      country: form.get('addressGroup.country').value as string,
    }) as Customer;
    const payment = PaymentMaker.create({
      cardNumber: +form.get('paymentGroup.cardNumber').value,
      cvv: +form.get('paymentGroup.cvv').value,
      expiringMonth: +form.get('paymentGroup.expiringMonth').value,
      expiringYear: +form.get('paymentGroup.expiringYear').value,
      total: +this.total,
    }) as Payment;
    const order = OrderMaker.create({
      customer: customer,
      items: items,
      payment: payment,
    }) as Order;
    this.checkOutService.placeOrder(order).subscribe(
      (result) => {
        this.orderPlaced = true;
        this.isLoading = false;
        items.forEach((item) => {
          this.cartService.removeItem(item).subscribe(
            (result) => {
              this.refreshCart();
              this.router.navigate(['/cart', 'success']);
            },
            (error) => {
              console.error(error);
              this.isLoading = false;
            }
          );
        });
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'There was an error saving your order';
      }
    );
  }

  private refreshCart(): void {
    this.cartService.setCurrentCart().subscribe({
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
