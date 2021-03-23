import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'ctacu-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @Input() pageTitle: string;
  isMenuCollapsed = true;
  cartQuantity$ = this.cartService.cartQuantity$;
  constructor(private readonly cartService: CartService) {}
}
