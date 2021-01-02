import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';
import { IOrder } from '../types/order';

@Component({
  selector: 'ctacu-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  submitted = false;
  loading = false;
  readonly user$ = this.authService.currentUser$;
  orders$ = this.orderService.orders$;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly orderService: OrderService,
    private readonly config: NgbAccordionConfig
  ) {
    config.closeOthers = true;
  }

  ngOnInit(): void {
    // this.user$.pipe(first()).subscribe({
    //   next: (user) => (this.orders$ = this.orderService.getOrders(+user.id)),
    // });
  }

  setLoading(value: boolean): void {
    this.loading = value;
  }

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['/user']);
  }
}
