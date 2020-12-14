import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  templateUrl: './success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessComponent implements OnInit {
  readonly pageTitle = 'Order Placed';

  constructor(private readonly cartService: CartService) {}

  ngOnInit(): void {
    // this.cartService.clearCart();
  }
}
