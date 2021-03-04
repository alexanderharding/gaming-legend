import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgbAccordionConfig,
  NgbProgressbarConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { emailMatcher } from 'src/app/functions/email-matcher';
import { CartService } from 'src/app/services/cart.service';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderService } from 'src/app/services/order.service';
import { ShippingRateService } from 'src/app/services/shipping-rate.service';
import { ICartItem } from 'src/app/types/cart-item';
import { Customer, CustomerMaker } from 'src/app/types/customer';
import { INotification } from 'src/app/types/notification';
import { Order, OrderMaker } from 'src/app/types/order';
import { Payment, PaymentMaker } from 'src/app/types/payment';
import { IShipping } from 'src/app/types/shipping';
import { ShippingRatesResult } from 'src/app/types/shipping-rates-result';

// function dateChecker(c: AbstractControl): { [key: string]: boolean } | null {
//   const monthControl = c.get('expiringMonth');
//   const yearControl = c.get('expiringYear');
//   const currentMonth = new Date().getMonth();
//   const currentYear = new Date().getFullYear();

//   if (monthControl.pristine || yearControl.pristine) {
//     return null;
//   }

//   if (+yearControl.value > currentYear) {
//     return null;
//   }

//   if (+monthControl.value >= currentMonth) {
//     return null;
//   }

//   return { expired: true };
// }

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
  providers: [NgbAccordionConfig],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent implements OnInit {
  /* Get data from resolver */
  private readonly resolvedData = this.route.snapshot.data
    .resolvedData as ShippingRatesResult;
  readonly shippingRates = this.resolvedData.shippingRates as IShipping[];
  errorMessage = this.resolvedData.error as string;

  /* Set pageTitle */
  readonly pageTitle = this.shippingRates
    ? ('Checkout' as string)
    : ('Retrieval Error' as string);

  /* NgbCollapse for showing and hiding the signUpCheck and passwordGroup in
  the view */
  // @ViewChild('collapse') private collapse: NgbCollapse;
  // isCollapsed = false;

  // private readonly subscriptions: Subscription[] = [];
  // user: IUser;
  // emailTakenMessage: string;
  submitted = false;
  orderPlaced = false;

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  /* Main form group */
  checkOutForm: FormGroup;

  /* Get form control validation rules from FormValidationService*/
  readonly nameMinLength = +this.formService.nameMinLength;
  readonly nameMaxLength = +this.formService.nameMaxLength;
  readonly streetMinLength = +this.formService.streetMinLength;
  readonly streetMaxLength = +this.formService.streetMaxLength;
  readonly cityMinLength = +this.formService.cityMinLength;
  readonly cityMaxLength = +this.formService.cityMaxLength;
  private readonly zipPattern = this.formService.zipPattern as RegExp;
  private readonly cvvPattern = /^[0-9]{3,4}$/;
  private readonly phonePattern = this.formService.phonePattern as RegExp;
  // private readonly passwordPattern = this.formService.passwordPattern as RegExp;

  constructor(
    private readonly accordionConfig: NgbAccordionConfig,
    private readonly progressBarConfig: NgbProgressbarConfig,
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    // private readonly authService: AuthService,
    private readonly formService: FormService,
    private readonly shippingRateService: ShippingRateService,
    private readonly notificationService: NotificationService,
    private readonly title: Title
  ) {
    accordionConfig.closeOthers = true;
    progressBarConfig.striped = true;
    progressBarConfig.animated = true;
  }

  ngOnInit(): void {
    this.title.setTitle(`Gaming Legend | ${this.pageTitle}`);
    // Build check out form
    this.checkOutForm = this.fb.group({
      nameGroup: this.fb.group({
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
      }),
      contactGroup: this.fb.group(
        {
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
        country: ['USA', [Validators.required]],
      }),
      paymentGroup: this.fb.group({
        cardNumber: [null, [Validators.required, cardNumberChecker]],
        cvv: [null, [Validators.required, Validators.pattern(this.cvvPattern)]],
        expiration: ['', [Validators.required]],
      }),
      // signUpCheck: true,
      // passwordGroup: this.fb.group(
      //   {
      //     password: [
      //       '',
      //       [Validators.required, Validators.pattern(this.passwordPattern)],
      //     ],
      //     confirmPassword: ['', [Validators.required]],
      //   },
      //   { validator: passwordMatcher }
      // ),
    });

    // this.subscribeToValueChanges();
    // this.authService.currentUser$.pipe(first()).subscribe((user) => {
    //   if (user) {
    //     this.user = user as IUser;
    //     this.checkOutForm.patchValue({
    //       signUpCheck: false,
    //     });
    //   }
    // });
    if (this.shippingRates) {
      this.checkOutForm.patchValue({
        shippingRate: +this.shippingRates[0].price,
      });
    }
  }

  onSubmit(form: FormGroup): void {
    if (!this.submitted) {
      this.submitted = true;
    }
    if (form.valid) {
      this.setLoading(true);
      this.getOrder(form).subscribe({
        next: (order) => this.saveOrder(order, order.items),
        error: () => this.show('Error placing order !', true),
      });
      // const signUpCheck = this.checkOutForm.get('signUpCheck').value as boolean;
      // if (signUpCheck) {
      //   this.checkForUser(form, items);
      // } else {
      //   this.getOrder(form, items);
      // }
    }
  }

  // setPasswordValidation(value: boolean): void {
  //   const passwordGroupControl = this.checkOutForm.get('passwordGroup');
  //   const passwordControl = this.checkOutForm.get('passwordGroup.password');
  //   const confirmPasswordControl = this.checkOutForm.get(
  //     'passwordGroup.confirmPassword'
  //   );
  //   if (value) {
  //     passwordGroupControl.setValidators(passwordMatcher);
  //     passwordControl.setValidators([
  //       Validators.required,
  //       Validators.pattern(this.passwordPattern),
  //     ]);
  //     confirmPasswordControl.setValidators([Validators.required]);
  //   } else {
  //     passwordGroupControl.clearValidators();
  //     passwordControl.clearValidators();
  //     confirmPasswordControl.clearValidators();
  //   }
  //   passwordGroupControl.updateValueAndValidity();
  //   passwordControl.updateValueAndValidity();
  //   confirmPasswordControl.updateValueAndValidity();
  // }

  // setEmailTakenMessage(message: string): void {
  //   this.emailTakenMessage = message;
  // }

  // getActiveIdsString(user: User): string {
  //   if (!user) {
  //     return 'name';
  //   }
  //   if (!user.address) {
  //     return 'shipping';
  //   }
  //   return 'finalize';
  // }

  // private subscribeToValueChanges(): void {
  //   const signUpCheckControl = this.checkOutForm.get('signUpCheck');
  //   this.subscriptions.push(
  //     signUpCheckControl.valueChanges.subscribe((check: boolean) => {
  //       this.emailTakenMessage = '';
  //       this.setPasswordValidation(check);
  //       if (this.collapse) {
  //         this.collapse.toggle(check);
  //       }
  //     })
  //   );
  // }

  private setLoading(value: boolean): void {
    this.loadingSubject.next(value);
  }

  private show(text: string, danger: boolean): void {
    const notification = {
      textOrTpl: text,
      className: danger ? 'bg-danger text-light' : 'bg-success text-light',
      delay: danger ? 15000 : 10000,
    } as INotification;
    this.notificationService.show(notification);
  }

  // private checkForUser(form: FormGroup, items: ICartItem[]): void {
  //   const email = this.checkOutForm.get('contactGroup.email').value as string;
  //   this.authService.checkForUser(email).subscribe(
  //     (result) => {
  //       if (result) {
  //         this.setLoading(false);
  //         this.emailTakenMessage = `${email} is already registered to an
  //         account. Please sign in to continue.`;
  //       } else {
  //         this.saveUser(form, items);
  //       }
  //     },
  //     (error) => {
  //       this.setLoading(false);
  //       this.showDanger(this.saveUserDangerTpl);
  //     }
  //   );
  // }

  // private saveUser(form: FormGroup, items: ICartItem[]): void {
  //   const user = UserMaker.create({
  //     name: UserNameMaker.create({
  //       firstName: form.get('nameGroup.firstName').value as string,
  //       lastName: form.get('nameGroup.lastName').value as string,
  //     } as UserName),
  //     contact: UserContactMaker.create({
  //       phone: form.get('contactGroup.phone').value as string,
  //       email: form.get('contactGroup.email').value as string,
  //     } as UserContact),
  //     address: UserAddressMaker.create({
  //       street: form.get('addressGroup.street').value as string,
  //       city: form.get('addressGroup.city').value as string,
  //       state: form.get('addressGroup.state').value as string,
  //       zip: form.get('addressGroup.zip').value as string,
  //       country: form.get('addressGroup.country').value as string,
  //     } as UserAddress),
  //     password: form.get('passwordGroup.password').value as string,
  //     isAdmin: false,
  //   }) as User;
  //   this.authService.saveUser(user).subscribe(
  //     (result) => this.getOrder(form, items),
  //     (error) => {
  //       this.setLoading(false);
  //       this.showDanger(this.saveUserDangerTpl);
  //     }
  //   );
  // }

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
        this.removeAllItems(items);
      },
    });
  }

  private removeAllItems(items: ICartItem[]): void {
    this.cartService.removeAllItems(items).subscribe({
      error: () => this.show(`Error emptying cart !`, true),
      complete: () => {
        this.getCartItems();
        this.setLoading(false);
        this.router.navigate(['/user', 'order-placed']);
      },
    });
  }

  private getCartItems(): void {
    this.cartService.getCartItems().subscribe({
      error: () => this.show(`Error retrieving cart !`, true),
      complete: () => this.setLoading(false),
    });
  }
}
