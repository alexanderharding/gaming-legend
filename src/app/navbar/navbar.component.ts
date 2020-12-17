import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'ctacu-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class NavbarComponent implements OnInit {
  errorMessage: string;
  @Input() readonly pageTitle: string;

  isMenuCollapsed = true;

  cartQuantity$ = this.cartService.cartQuantity$;
  currentUser$ = this.authService.currentUser$;

  constructor(
    private readonly cartService: CartService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.setCurrentCart().subscribe({
      error: (error) => {
        this.errorMessage = `Retrieval error: ${error}.`;
      },
    });
  }

  signOut(): void {
    this.isMenuCollapsed = false;
    // this.authService.signOut();
  }
}
