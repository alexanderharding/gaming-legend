import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { tap } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'ctacu-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  readonly tax = +this.cartService.tax;
  readonly items$ = this.cartService.cartAction$;
  readonly quantity$ = this.cartService.cartQuantity$;
  readonly subtotal$ = this.cartService.subtotal$;
  readonly totalTax$ = this.cartService.totalTax$;
  readonly total$ = this.cartService.total$.pipe(
    tap(() => this.onTotalChange.emit(false))
  );
  readonly shippingPrice$ = this.cartService.shippingSelectedAction$;

  @Output() onTotalChange = new EventEmitter<boolean>();

  constructor(private readonly cartService: CartService) {}
}
