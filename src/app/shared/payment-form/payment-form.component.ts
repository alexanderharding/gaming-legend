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
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';

@Component({
  selector: 'ctacu-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentFormComponent implements OnInit, OnDestroy {
  readonly pageTitle = 'Payment';
  /* Get data from FormValidationRuleService */
  readonly monthOptions = this.formValidationRuleService.monthOptions;
  readonly yearOptions = this.formValidationRuleService.getYearOptions();

  @Input() parentForm: FormGroup;
  @Input() submitted: boolean;

  private readonly subscriptions: Subscription[] = [];

  private readonly cardNumberValidationMessages = {
    required: 'Please enter your card number.',
    cardNumber: 'Please enter a valid card number with no hyphens.',
  };
  private readonly cardNumberMessageSubject = new BehaviorSubject<string>(
    this.cardNumberValidationMessages.required
  );
  readonly cardNumberMessage$ = this.cardNumberMessageSubject.asObservable();

  private readonly monthValidationMessages = {
    required: 'Please select the month your card expires.',
  };
  private readonly monthMessageSubject = new BehaviorSubject<string>(
    this.monthValidationMessages.required
  );
  readonly monthMessage$ = this.monthMessageSubject.asObservable();

  private readonly yearValidationMessages = {
    required: 'Please select the year your card expires.',
  };
  private readonly yearMessageSubject = new BehaviorSubject<string>(
    this.yearValidationMessages.required
  );
  readonly yearMessage$ = this.yearMessageSubject.asObservable();

  private readonly cvvValidationMessages = {
    required: 'Please enter the security code on the back of your card.',
    pattern: 'Please enter a valid security code.',
  };
  private readonly cvvMessageSubject = new BehaviorSubject<string>(
    this.cvvValidationMessages.required
  );
  readonly cvvMessage$ = this.cvvMessageSubject.asObservable();

  private readonly paymentGroupValidationMessages = {
    expired: 'Please select a valid expiration date.',
  };
  private readonly paymentGroupMessageSubject = new BehaviorSubject<string>(
    this.paymentGroupValidationMessages.expired
  );
  readonly paymentGroupMessage$ = this.paymentGroupMessageSubject.asObservable();

  constructor(
    private readonly formValidationRuleService: FormValidationRuleService
  ) {}

  ngOnInit(): void {
    this.subscribeToControls();
  }

  private subscribeToControls(): void {
    const cardNumberControl = this.parentForm.get('paymentGroup.cardNumber');
    this.subscriptions.push(
      cardNumberControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(cardNumberControl, 'cardNumber'))
    );
    const paymentGroupControl = this.parentForm.get('paymentGroup');
    this.subscriptions.push(
      paymentGroupControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(paymentGroupControl, 'paymentGroup'))
    );
    const expiringMonthControl = this.parentForm.get(
      'paymentGroup.expiringMonth'
    );
    this.subscriptions.push(
      expiringMonthControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(expiringMonthControl, 'month'))
    );
    const expiringYearControl = this.parentForm.get(
      'paymentGroup.expiringYear'
    );
    this.subscriptions.push(
      expiringYearControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(expiringYearControl, 'year'))
    );
    const cvvControl = this.parentForm.get('paymentGroup.cvv');
    this.subscriptions.push(
      cvvControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(cvvControl, 'cvv'))
    );
  }

  populateTestData(): void {
    this.parentForm.patchValue({
      paymentGroup: {
        cardNumber: 4123147523147547,
        cvv: 123,
        expiringMonth: 7,
        expiringYear: 2021,
      },
    });
  }
  private setMessage(c: AbstractControl, name: string): void {
    let message = '';
    switch (name) {
      case 'cardNumber':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.cardNumberValidationMessages[key])
            .join(' ');
        }
        this.cardNumberMessageSubject.next(message);
        break;
      case 'month':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.monthValidationMessages[key])
            .join(' ');
        }
        this.monthMessageSubject.next(message);
        break;
      case 'year':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.yearValidationMessages[key])
            .join(' ');
        }
        this.yearMessageSubject.next(message);
        break;
      case 'cvv':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.cvvValidationMessages[key])
            .join(' ');
        }
        this.cvvMessageSubject.next(message);
        break;
      case 'paymentGroup':
        if (c.errors) {
          message = Object.keys(c.errors)
            .map((key) => this.paymentGroupValidationMessages[key])
            .join(' ');
        }
        this.paymentGroupMessageSubject.next(message);
        break;
      default:
        console.error(`${name} did not match any names.`);
        break;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
