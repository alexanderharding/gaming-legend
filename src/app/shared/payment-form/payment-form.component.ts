import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormValidationRuleService } from 'src/app/services/form-validation-rule.service';

@Component({
  selector: 'ctacu-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
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
        .subscribe(() => this.setMessage(paymentGroupControl, 'payment'))
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

      default:
        console.error(`${name} did not match any names.`);
        break;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
