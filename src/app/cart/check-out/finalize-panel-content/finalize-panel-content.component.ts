import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { CheckOutService } from 'src/app/services/check-out.service';

@Component({
  selector: 'ctacu-finalize-panel-content',
  templateUrl: './finalize-panel-content.component.html',
  styleUrls: ['./finalize-panel-content.component.scss'],
})
export class FinalizePanelContentComponent implements OnInit {
  /* Get data from CheckOutService */
  readonly monthOptions = this.checkOutService.monthOptions;
  readonly yearOptions = this.checkOutService.getYearOptions();

  /* Get data from CartService */
  tax = this.cartService.tax;
  totalTax$ = this.cartService.totalTax$;
  total$ = this.cartService.total$.pipe(
    tap((total) => {
      this.totalChange.emit(+total);
      return total;
    })
  );
  @Input() subtotal$: Observable<number>;
  shippingPrice$ = this.cartService.shippingSelectedAction$;

  @Input() checkOutForm: FormGroup;
  @Input() submitted: boolean;
  @Input() isLoading: boolean;

  @Input() errorMessage: boolean;
  @Input() signUpError: number;

  @Output() onSubmit = new EventEmitter<FormGroup>();
  @Output() toggle = new EventEmitter<string>();
  @Output() check = new EventEmitter<boolean>();
  @Output() totalChange = new EventEmitter<number>();

  private subscriptions: Subscription[] = [];

  private readonly cardNumberValidationMessages = {
    required: 'Please enter your card number.',
    cardNumber: 'Please enter a valid card number with no hyphens.',
  };
  cardNumberMessage = this.cardNumberValidationMessages['required'];

  private readonly monthValidationMessages = {
    required: 'Please select the month your card expires.',
  };
  monthMessage = this.monthValidationMessages['required'];

  private readonly yearValidationMessages = {
    required: 'Please select the year your card expires.',
  };
  yearMessage = this.yearValidationMessages['required'];

  private readonly cvvValidationMessages = {
    required: 'Please enter the security code on the back of your card.',
    pattern: 'Please enter a valid security code.',
  };
  cvvMessage = this.cvvValidationMessages['required'];

  private readonly paymentGroupValidationMessages = {
    expired: 'Please select a valid expiration date.',
  };
  paymentMessage = this.paymentGroupValidationMessages['expired'];

  private readonly passwordValidationMessages = {
    required: 'Please enter a password.',
    pattern: 'Please enter a valid password that is at least 8 characters.',
  };
  passwordMessage = this.passwordValidationMessages['required'];

  private readonly confirmPasswordValidationMessages = {
    required: 'Please confirm your password.',
  };
  confirmPasswordMessage = this.confirmPasswordValidationMessages['required'];

  private readonly signUpValidationMessages = {
    match: 'The confirmation does not match the password.',
  };
  signUpMessage = this.signUpValidationMessages['match'];

  constructor(
    private readonly checkOutService: CheckOutService,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    this.subToControls();
  }

  emitSubmission(): void {
    this.onSubmit.emit(this.checkOutForm);
  }

  togglePanel(panelTitle: string): void {
    this.toggle.emit(panelTitle);
  }

  private subToControls(): void {
    const cardNumberControl = this.checkOutForm.get('paymentGroup.cardNumber');
    this.subscriptions.push(
      cardNumberControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(cardNumberControl, 'cardNumber'))
    );
    const paymentGroupControl = this.checkOutForm.get('paymentGroup');
    this.subscriptions.push(
      paymentGroupControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(paymentGroupControl, 'payment'))
    );
    const expiringMonthControl = this.checkOutForm.get(
      'paymentGroup.expiringMonth'
    );
    this.subscriptions.push(
      expiringMonthControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(expiringMonthControl, 'month'))
    );
    const expiringYearControl = this.checkOutForm.get(
      'paymentGroup.expiringYear'
    );
    this.subscriptions.push(
      expiringYearControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(expiringYearControl, 'year'))
    );
    const cvvControl = this.checkOutForm.get('paymentGroup.cvv');
    this.subscriptions.push(
      cvvControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(cvvControl, 'cvv'))
    );
    const signUpControl = this.checkOutForm.get('signUpCheck');
    this.subscriptions.push(
      signUpControl.valueChanges.subscribe((check: boolean) =>
        this.check.emit(check)
      )
    );
    const passwordControl = this.checkOutForm.get('signUpGroup.password');
    this.subscriptions.push(
      passwordControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(passwordControl, 'password'))
    );
    const confirmPasswordControl = this.checkOutForm.get(
      'signUpGroup.confirmPassword'
    );
    this.subscriptions.push(
      confirmPasswordControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() =>
          this.setMessage(confirmPasswordControl, 'confirmPassword')
        )
    );
    const signUpGroupControl = this.checkOutForm.get('signUpGroup');
    this.subscriptions.push(
      signUpGroupControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(signUpGroupControl, 'signUp'))
    );
  }

  private setMessage(c: AbstractControl, name: string): void {
    switch (name) {
      case 'cardNumber':
        this.cardNumberMessage = '';
        if (c.errors) {
          this.cardNumberMessage = Object.keys(c.errors)
            .map((key) => this.cardNumberValidationMessages[key])
            .join(' ');
        }
        break;
      case 'month':
        this.monthMessage = '';
        if (c.errors) {
          this.monthMessage = Object.keys(c.errors)
            .map((key) => this.monthValidationMessages[key])
            .join(' ');
        }
        break;
      case 'year':
        this.yearMessage = '';
        if (c.errors) {
          this.yearMessage = Object.keys(c.errors)
            .map((key) => this.yearValidationMessages[key])
            .join(' ');
        }
        break;
      case 'cvv':
        this.cvvMessage = '';
        if (c.errors) {
          this.cvvMessage = Object.keys(c.errors)
            .map((key) => this.cvvValidationMessages[key])
            .join(' ');
        }
        break;
      case 'payment':
        this.paymentMessage = '';
        if (c.errors) {
          this.paymentMessage = Object.keys(c.errors)
            .map((key) => this.paymentGroupValidationMessages[key])
            .join(' ');
        }
        break;
      case 'password':
        this.passwordMessage = '';
        if (c.errors) {
          this.passwordMessage = Object.keys(c.errors)
            .map((key) => this.passwordValidationMessages[key])
            .join(' ');
        }
        break;
      case 'confirmPassword':
        this.confirmPasswordMessage = '';
        if (c.errors) {
          this.confirmPasswordMessage = Object.keys(c.errors)
            .map((key) => this.confirmPasswordValidationMessages[key])
            .join(' ');
        }
        break;
      case 'signUp':
        this.signUpMessage = '';
        if (c.errors) {
          this.signUpMessage = Object.keys(c.errors)
            .map((key) => this.signUpValidationMessages[key])
            .join(' ');
        }
        break;
      default:
        console.error(`${name} did not match any names.`);
        break;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
