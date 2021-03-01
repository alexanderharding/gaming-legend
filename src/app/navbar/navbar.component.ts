import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
// import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { NotificationService } from '../services/notification.service';
import { INotification } from '../types/notification';

@Component({
  selector: 'ctacu-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  @Input() pageTitle: string;
  isMenuCollapsed = true;

  /* Get cartQuantity$ from CartService */
  cartQuantity$ = this.cartService.cartQuantity$;

  /* Get currentUser$ from AuthService */
  // currentUser$ = this.authService.currentUser$;

  constructor(
    private readonly cartService: CartService,
    // private readonly authService: AuthService,
    private readonly notifcationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe({
      error: () => {
        const notification = {
          textOrTpl: 'Cart Retrieval Error !',
          className: 'bg-danger text-light',
          delay: 15000,
        } as INotification;
        this.notifcationService.show(notification);
      },
    });
  }
}
