import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'ctacu-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  @Input() pageTitle: string;
  errorMessage: string;
  isMenuCollapsed = true;

  /* Get cartQuantity$ from CartService */
  cartQuantity$ = this.cartService.cartQuantity$;

  /* Get currentUser$ from AuthService */
  currentUser$ = this.authService.currentUser$;

  constructor(
    private readonly cartService: CartService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe({
      error: (err) => (this.errorMessage = `Retrieval error: ${err}.`),
    });
  }
}
