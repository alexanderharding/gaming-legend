import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { IOrder } from '../types/order';
import { OrdersResult } from '../types/orders-result';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  /* Get data from resolver */
  private readonly resolvedData = this.route.snapshot.data
    .resolvedData as OrdersResult;
  readonly orders = this.resolvedData.orders as IOrder[];
  readonly errorMessage = this.resolvedData.error as string;
  submitted = false;
  loading = false;
  readonly user$ = this.authService.currentUser$;
  filterForm: FormGroup;

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly config: NgbAccordionConfig
  ) {
    config.closeOthers = true;
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: '',
      sort: null,
    });

    const searchControl = this.filterForm.get('search');
    this.subscriptions.push(searchControl.valueChanges.subscribe());
    const sortControl = this.filterForm.get('sort');
    this.subscriptions.push(sortControl.valueChanges.subscribe());

    this.filterForm.patchValue({
      sort: 0,
    });
  }

  setLoading(value: boolean): void {
    this.loading = value;
  }

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['/user']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
