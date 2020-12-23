import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'ctacu-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
})
export class CartSummaryComponent {
  readonly tax = +this.cartService.tax;
  readonly items$ = this.cartService.cartAction$;
  readonly quantity$ = this.cartService.cartQuantity$;
  readonly subtotal$ = this.cartService.subtotal$;
  readonly totalTax$ = this.cartService.totalTax$;
  readonly total$ = this.cartService.total$;
  readonly shippingPrice$ = this.cartService.shippingSelectedAction$;

  constructor(private readonly cartService: CartService) {}
}
