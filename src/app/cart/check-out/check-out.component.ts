import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgbAccordionConfig,
  NgbCollapse,
  NgbProgressbarConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, EMPTY, Subscription } from 'rxjs';
import { catchError, debounceTime, first, map } from 'rxjs/operators';

import { emailMatcher } from 'src/app/functions/email-matcher';
import { passwordMatcher } from 'src/app/functions/password-matcher';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';
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
import { IUser, User, UserMaker } from 'src/app/types/user';
import { UserAddressMaker, UserAddress } from 'src/app/types/user-address';
import { UserContactMaker, UserContact } from 'src/app/types/user-contact';
import { UserName, UserNameMaker } from 'src/app/types/user-name';

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

@Component({
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
  providers: [NgbAccordionConfig],
})
export class CheckOutComponent implements OnInit, OnDestroy {
  /* Get data from CartService */
  readonly items$ = this.cartService.cartItems$;
  readonly cartQuantity$ = this.cartService.cartQuantity$;
  readonly subtotal$ = this.cartService.subtotal$;

  /* Get data from CheckOutService */
  readonly states = this.formValidationRuleService.states;

  /* Get data from resolver */
  private readonly resolvedData = this.route.snapshot.data
    .resolvedData as ShippingRatesResult;
  readonly shippingRates = this.resolvedData.shippingRates as IShipping[];
  errorMessage = this.resolvedData.error as string;

  /* Set pageTitle */
  readonly pageTitle = this.shippingRates
    ? ('Check Out' as string)
    : ('Retrieval Error' as string);

  /* NgbCollapse for showing and hiding the signUpCheck and passwordGroup in
  the view */
  @ViewChild('collapse') private collapse: NgbCollapse;
  isCollapsed = false;

  /* Notification templateRef's */
  @ViewChild('orderSuccessTpl') private orderSuccessTpl: TemplateRef<any>;
  @ViewChild('orderDangerTpl') private orderDangerTpl: TemplateRef<any>;
  @ViewChild('saveUserDangerTpl') private saveUserDangerTpl: TemplateRef<any>;
  @ViewChild('clearCartDangerTpl') private clearCartDangerTpl: TemplateRef<any>;

  private readonly subscriptions: Subscription[] = [];
  deliveryDate: Date;
  user: IUser;
  emailTakenMessage: string;
  submitted = false;
  orderPlaced = false;
  isLoading = false;

  /* Main form group */
  checkOutForm: FormGroup;

  /* Get form control validation rules from FormValidationService*/
  readonly nameMinLength = +this.formValidationRuleService.nameMinLength;
  readonly nameMaxLength = +this.formValidationRuleService.nameMaxLength;
  readonly streetMinLength = +this.formValidationRuleService.streetMinLength;
  readonly streetMaxLength = +this.formValidationRuleService.streetMaxLength;
  readonly cityMinLength = +this.formValidationRuleService.cityMinLength;
  readonly cityMaxLength = +this.formValidationRuleService.cityMaxLength;
  private readonly zipPattern = this.formValidationRuleService
    .zipPattern as RegExp;
  private readonly cvvPattern = this.formValidationRuleService
    .cvvPattern as RegExp;
  private readonly phonePattern = this.formValidationRuleService
    .phonePattern as RegExp;
  private readonly passwordPattern = this.formValidationRuleService
    .passwordPattern as RegExp;

  constructor(
    private readonly accordionConfig: NgbAccordionConfig,
    private readonly progressBarConfig: NgbProgressbarConfig,
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly formValidationRuleService: FormValidationRuleService,
    private readonly shippingRateService: ShippingRateService,
    private readonly notificationService: NotificationService
  ) {
    accordionConfig.closeOthers = true;
    progressBarConfig.striped = true;
    progressBarConfig.animated = true;
  }

  ngOnInit(): void {
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
      passwordGroup: this.fb.group(
        {
          password: [
            '',
            [Validators.required, Validators.pattern(this.passwordPattern)],
          ],
          confirmPassword: ['', [Validators.required]],
          // showPassword: false,
        },
        { validator: passwordMatcher }
      ),
    });

    this.subscribeToValueChanges();
    this.authService.currentUser$.pipe(first()).subscribe((user) => {
      if (user) {
        this.user = user as IUser;
        this.checkOutForm.patchValue({
          signUpCheck: false,
        });
      }
    });
    if (this.shippingRates) {
      this.checkOutForm.patchValue({
        shippingRate: +this.shippingRates[0].price,
      });
    }
  }

  onSubmit(form: FormGroup, items: ICartItem[]): void {
    if (!this.submitted) {
      this.submitted = true;
    }
    this.errorMessage = '';
    if (form.valid) {
      this.isLoading = true;
      const signUpCheck = this.checkOutForm.get('signUpCheck').value as boolean;
      if (signUpCheck) {
        this.checkForUser(form, items);
      } else {
        this.createOrder(form, items);
      }
    }
  }

  setPasswordValidation(value: boolean): void {
    const passwordGroupControl = this.checkOutForm.get('passwordGroup');
    const passwordControl = this.checkOutForm.get('passwordGroup.password');
    const confirmPasswordControl = this.checkOutForm.get(
      'passwordGroup.confirmPassword'
    );
    if (value) {
      passwordGroupControl.setValidators(passwordMatcher);
      passwordControl.setValidators([
        Validators.required,
        Validators.pattern(this.passwordPattern),
      ]);
      confirmPasswordControl.setValidators([Validators.required]);
    } else {
      passwordGroupControl.clearValidators();
      passwordControl.clearValidators();
      confirmPasswordControl.clearValidators();
    }
    passwordGroupControl.updateValueAndValidity();
    passwordControl.updateValueAndValidity();
    confirmPasswordControl.updateValueAndValidity();
  }

  setEmailTakenMessage(message: string): void {
    this.emailTakenMessage = message;
  }

  private subscribeToValueChanges(): void {
    const shippingRateControl = this.checkOutForm.get('shippingRate');
    this.subscriptions.push(
      shippingRateControl.valueChanges
        .pipe(debounceTime(500))
        .subscribe((price: number) => {
          this.setDeliveryDate(+price);
          this.shippingRateService.setShipping(+price);
        })
    );
    const signUpCheckControl = this.checkOutForm.get('signUpCheck');
    this.subscriptions.push(
      signUpCheckControl.valueChanges.subscribe((check: boolean) => {
        this.emailTakenMessage = '';
        this.setPasswordValidation(check);
        if (this.collapse) {
          this.collapse.toggle(check);
        }
      })
    );
  }

  private showSuccess(templateRef: TemplateRef<any>): void {
    const notification = {
      textOrTpl: templateRef,
      className: 'bg-success text-light',
      delay: 15000,
    } as INotification;
    this.notificationService.show(notification);
  }

  private showDanger(templateRef: TemplateRef<any>): void {
    const notification = {
      textOrTpl: templateRef,
      className: 'bg-danger text-light',
      delay: 15000,
    } as INotification;
    this.notificationService.show(notification);
  }

  private checkForUser(form: FormGroup, items: ICartItem[]): void {
    const email = this.checkOutForm.get('contactGroup.email').value as string;
    this.authService.checkForUser(email).subscribe(
      (result) => {
        if (result) {
          this.isLoading = false;
          this.emailTakenMessage = `${email} is already registered to an
          account. Please sign in to continue.`;
        } else {
          this.saveUser(form, items);
        }
      },
      (error) => {
        this.isLoading = false;
        this.showDanger(this.saveUserDangerTpl);
      }
    );
  }

  private saveUser(form: FormGroup, items: ICartItem[]): void {
    const user = UserMaker.create({
      name: UserNameMaker.create({
        firstName: form.get('nameGroup.firstName').value as string,
        lastName: form.get('nameGroup.lastName').value as string,
      } as UserName),
      contact: UserContactMaker.create({
        phone: form.get('contactGroup.phone').value as string,
        email: form.get('contactGroup.email').value as string,
      } as UserContact),
      address: UserAddressMaker.create({
        street: form.get('addressGroup.street').value as string,
        city: form.get('addressGroup.city').value as string,
        state: form.get('addressGroup.state').value as string,
        zip: form.get('addressGroup.zip').value as string,
        country: form.get('addressGroup.country').value as string,
      } as UserAddress),
      password: form.get('passwordGroup.password').value as string,
      isAdmin: false,
    }) as User;
    this.authService.saveUser(user).subscribe(
      (result) => this.createOrder(form, items),
      (error) => {
        this.isLoading = false;
        this.showDanger(this.saveUserDangerTpl);
      }
    );
  }

  private createOrder(form: FormGroup, items: ICartItem[]): void {
    const order$ = combineLatest([
      this.subtotal$,
      this.shippingRateService.shippingPriceSelectedAction$,
      this.cartService.totalTax$,
      this.cartService.total$,
    ]).pipe(
      first(),
      map(([subtotal, shipping, totalTax, total]) => {
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
          expiringMonth: +form.get('paymentGroup.expiringMonth').value,
          expiringYear: +form.get('paymentGroup.expiringYear').value,
          subtotal: +subtotal,
          tax: +totalTax,
          shipping: +shipping,
          total: +total,
        }) as Payment;
        let order = OrderMaker.create({
          customer: customer,
          items: items,
          payment: payment,
          date: new Date(),
          status: 'pending',
        }) as Order;
        if (this.user) {
          order = {
            ...order,
            userId: +this.user.id,
          } as Order;
        }
        return order;
      }),
      catchError(() => {
        this.showDanger(this.orderDangerTpl);
        return EMPTY;
      })
    );
    order$.subscribe(
      (order) => this.saveOrder(order, items),
      (error) => this.showDanger(this.orderDangerTpl)
    );
  }

  private setDeliveryDate(selectedPrice: number): void {
    const totalDays = this.shippingRates.find(
      ({ price }) => price === +selectedPrice
    ).rate;
    this.deliveryDate = this.shippingRateService.getDeliveryDate(totalDays);
  }

  private saveOrder(order: Order, items: ICartItem[]): void {
    this.orderService.saveOrder(order, -1).subscribe(
      (result) => {
        this.orderPlaced = true;
        this.showSuccess(this.orderSuccessTpl);
        this.removeAllItems(items);
      },
      (error) => {
        this.isLoading = false;
        this.showDanger(this.orderDangerTpl);
      }
    );
  }

  private removeAllItems(items: ICartItem[]): void {
    this.cartService.removeAllItems(items).subscribe({
      error: (err) => {
        console.error(err);
        this.showDanger(this.clearCartDangerTpl);
      },
      complete: () => {
        this.getCartItems();
        this.router.navigate(['/cart', 'success']);
      },
    });
  }

  private getCartItems(): void {
    this.cartService.getCartItems().subscribe({
      error: (error) => console.error(error),
      complete: () => (this.isLoading = false),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
