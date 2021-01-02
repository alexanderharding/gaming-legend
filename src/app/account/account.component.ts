import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, EMPTY, Subscription } from 'rxjs';
import { catchError, debounceTime, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { IOrder } from '../types/order';
import { OrdersResult } from '../types/orders-result';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  /* Get data from resolver */
  private readonly resolvedData = this.route.data.pipe(
    map((d) => d.resolvedData as OrdersResult)
  );
  readonly orders$ = this.resolvedData.pipe(map((r) => r.orders as IOrder[]));
  readonly error$ = this.resolvedData.pipe(map((r) => r.error as string));

  /* Get user from AuthService */
  readonly user$ = this.authService.currentUser$;

  submitted = false;
  loading = false;

  filterForm: FormGroup;

  private readonly subscriptions: Subscription[] = [];

  private readonly searchSubject = new BehaviorSubject<string>('');
  private readonly searchAction$ = this.searchSubject.asObservable();

  readonly filteredOrders$ = combineLatest([
    this.orders$,
    this.searchAction$,
  ]).pipe(
    debounceTime(1000),
    map(
      ([orders, search]) =>
        orders.filter((o) =>
          search ? o.id.toString().indexOf(search) > -1 : true
        ) as IOrder[]
    ),
    catchError((err) => {
      console.log(err);
      return EMPTY;
    })
  );

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
    this.subscriptions.push(
      searchControl.valueChanges.subscribe((value: string) =>
        this.searchSubject.next(value)
      )
    );
    const sortControl = this.filterForm.get('sort');
    this.subscriptions.push(sortControl.valueChanges.subscribe(() => {}));

    this.filterForm.patchValue({
      sort: 0,
    });
  }

  clearSearch(): void {
    this.filterForm.patchValue({
      search: '',
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
