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

@Component({
  selector: 'ctacu-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentFormComponent implements OnInit, OnDestroy {
  private readonly date = new Date();
  private readonly month = this.date.getMonth();
  private readonly fullYear = this.date.getFullYear();
  readonly cardMinExpiration = `${this.fullYear}-0${this.month + 1}`;
  readonly cardMaxExpiration = `${this.fullYear + 8}-0${this.month + 1}`;
  readonly pageTitle = 'Payment';

  @Input() parentForm: FormGroup;
  @Input() submitted: boolean;

  private readonly subscriptions: Subscription[] = [];

  private readonly cardNumberValidationMessages = {
    required: 'Please enter a card number.',
    cardNumber: 'Please enter a valid card number with no hyphens.',
  };
  private readonly cardNumberMessageSubject = new BehaviorSubject<string>(
    this.cardNumberValidationMessages.required
  );
  readonly cardNumberMessage$ = this.cardNumberMessageSubject.asObservable();

  private readonly expirationValidationMessages = {
    required: 'Please enter an expiration date.',
  };
  private readonly expirationMessageSubject = new BehaviorSubject<string>(
    this.expirationValidationMessages.required
  );
  readonly expirationMessage$ = this.expirationMessageSubject.asObservable();

  private readonly cvvValidationMessages = {
    required: 'Please enter the security code on the back of your card.',
    pattern: 'Please enter a valid security code.',
  };
  private readonly cvvMessageSubject = new BehaviorSubject<string>(
    this.cvvValidationMessages.required
  );
  readonly cvvMessage$ = this.cvvMessageSubject.asObservable();

  constructor() {}

  ngOnInit(): void {
    this.subscribeToControls();
  }

  populateTestData(): void {
    this.parentForm.patchValue({
      paymentGroup: {
        cardNumber: 4123147523147547,
        cvv: 123,
        expiration: this.cardMinExpiration,
      },
    });
  }

  private subscribeToControls(): void {
    const cardNumberControl = this.parentForm.get('paymentGroup.cardNumber');
    this.subscriptions.push(
      cardNumberControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(cardNumberControl, 'cardNumber'))
    );
    const expirationControl = this.parentForm.get('paymentGroup.expiration');
    this.subscriptions.push(
      expirationControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(expirationControl, 'expiration'))
    );
    const cvvControl = this.parentForm.get('paymentGroup.cvv');
    this.subscriptions.push(
      cvvControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe(() => this.setMessage(cvvControl, 'cvv'))
    );
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
