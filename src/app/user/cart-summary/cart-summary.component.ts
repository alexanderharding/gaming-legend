import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CartService } from 'src/app/services/cart.service';
import { ShippingRateService } from 'src/app/services/shipping-rate.service';

@Component({
  selector: 'ctacu-cart-summary',
  templateUrl: './cart-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  readonly tax = +this.cartService.tax;
  readonly items$ = this.cartService.cartItems$;
  readonly quantity$ = this.cartService.cartQuantity$;
  readonly subtotal$ = this.cartService.subtotal$;
  readonly totalTax$ = this.cartService.totalTax$;
  readonly total$ = this.cartService.total$;
  readonly shippingPrice$ = this.shippingRateService
    .shippingPriceSelectedAction$;

  constructor(
    private readonly cartService: CartService,
    private readonly shippingRateService: ShippingRateService
  ) {}
}