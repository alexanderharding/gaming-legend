import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { IOrder } from '../types/order';
import { OrdersResult } from '../types/orders-result';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  /* Get data from resolver */
  private readonly resolvedData = this.route.snapshot.data
    .resolvedData as OrdersResult;
  readonly orders = this.resolvedData.orders as IOrder[];
  readonly errorMessage = this.resolvedData.error as string;
  submitted = false;
  loading = false;
  readonly user$ = this.authService.currentUser$;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly config: NgbAccordionConfig
  ) {
    config.closeOthers = true;
  }

  setLoading(value: boolean): void {
    this.loading = value;
  }

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['/user']);
  }
}
