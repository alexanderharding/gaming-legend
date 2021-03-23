import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';

import { CartService } from 'src/app/services/cart.service';
import { ShippingRateService } from 'src/app/services/shipping-rate.service';
import { IShipping } from 'src/app/types/shipping';

@Component({
  selector: 'user-cart-summary',
  templateUrl: './cart-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  readonly items$ = this.cartService.cartItems$;
  readonly subtotal$ = this.cartService.subtotal$;
  readonly totalTax$ = this.cartService.totalTax$;
  readonly total$ = this.cartService.total$;
  readonly shippingPrice$ = this.shippingRateService
    .shippingPriceSelectedAction$;
  shippingForm: FormGroup;

  @Input() shippingRates: IShipping[];

  constructor(
    private readonly cartService: CartService,
    private readonly shippingRateService: ShippingRateService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.shippingForm = this.fb.group({
      price: null,
    });

    const priceControl = this.shippingForm.controls.price;
    this.subscriptions.push(
      priceControl.valueChanges
        .pipe(debounceTime(500))
        .subscribe((price) => this.shippingRateService.setShipping(+price))
    );

    this.shippingPrice$
      .pipe(first())
      .subscribe((p) =>
        p
          ? priceControl.setValue(+p)
          : priceControl.setValue(+this.shippingRates[0].price)
      );
  }

  getDeliveryDate(days: number): Date {
    return this.shippingRateService.getDeliveryDate(+days);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe);
  }
}
