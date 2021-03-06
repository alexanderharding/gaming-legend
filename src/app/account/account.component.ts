import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, EMPTY, Subscription } from 'rxjs';
import { catchError, debounceTime, first, map } from 'rxjs/operators';
// import { AuthService } from '../services/auth.service';
import { NotificationService } from '../core/notification.service';
import { INotification } from '../types/notification';
import { IOrder } from '../types/order';
import { OrdersResult } from '../types/orders-result';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent implements OnInit, OnDestroy {
  // @ViewChild('successTpl') private successTpl: TemplateRef<any>;

  // errorMessage = '';
  // page = 1;
  // pageSize = 5;
  // activeId = 1;

  // private readonly searchValidationMessages = {
  //   pattern: 'Please only use numbers.',
  // };
  // searchMessage = '';

  // /* Get data from resolver */
  // private readonly resolvedData = this.route.data.pipe(
  //   map((d) => d.resolvedData as OrdersResult)
  // );
  // readonly orders$ = this.resolvedData.pipe(map((r) => r.orders as IOrder[]));
  // readonly error$ = this.resolvedData.pipe(map((r) => r.error as string));

  // /* Get user from AuthService */
  // readonly user$ = this.authService.currentUser$;

  // submitted = false;
  // loading = false;

  // filterForm: FormGroup;

  // private readonly subscriptions: Subscription[] = [];

  // private readonly searchSubject = new BehaviorSubject<string>('');
  // private readonly searchAction$ = this.searchSubject.asObservable();

  // private readonly filteredOrders$ = combineLatest([
  //   this.orders$,
  //   this.searchAction$,
  // ]).pipe(
  //   debounceTime(1000),
  //   map(
  //     ([orders, search]) =>
  //       orders.filter((o) =>
  //         search ? o.id.toString().indexOf(search) > -1 : true
  //       ) as IOrder[]
  //   ),
  //   catchError((err) => {
  //     console.log(err);
  //     return EMPTY;
  //   })
  // );

  // private readonly sortSubject = new BehaviorSubject<number>(0);
  // private readonly sortAction$ = this.sortSubject.asObservable();

  // readonly sortedOrders$ = combineLatest([
  //   this.filteredOrders$,
  //   this.sortAction$,
  // ]).pipe(
  //   debounceTime(500),
  //   map(([orders, sort]) => {
  //     switch (sort) {
  //       case 1:
  //         this.setLoading(false);
  //         return orders.sort(
  //           (a, b) => +new Date(a.date) - +new Date(b.date)
  //         ) as IOrder[];
  //       case 2:
  //         this.setLoading(false);
  //         return orders.filter((o) =>
  //           sort ? o.status.toLowerCase().indexOf('pending') > -1 : true
  //         );
  //       case 3:
  //         this.setLoading(false);
  //         return orders.filter((o) =>
  //           sort ? o.status.toLowerCase().indexOf('completed') > -1 : true
  //         );
  //       default:
  //         this.setLoading(false);
  //         return orders.sort(
  //           (a, b) => +new Date(b.date) - +new Date(a.date)
  //         ) as IOrder[];
  //     }
  //   })
  // );

  constructor() // private readonly route: ActivatedRoute, // private readonly router: Router, // private readonly authService: AuthService,
  // private readonly fb: FormBuilder,
  // private readonly notificationService: NotificationService
  {}

  ngOnInit(): void {
    // this.user$.pipe(first()).subscribe((user) => {
    //   if (!user.address) {
    //     this.activeId = 3;
    //   }
    // });
    // this.filterForm = this.fb.group({
    //   search: ['', Validators.pattern(/^\d+$/)],
    //   sort: 0,
    // });
    // this.subscribeToControls();
  }

  // resetControl(c: AbstractControl): void {
  //   c.reset();
  // }

  // setLoading(value: boolean): void {
  //   this.loading = value;
  // }

  // signOut(): void {
  //   this.authService.signOut();
  //   this.showSuccess();
  //   this.router.navigate(['/user']);
  // }

  // private subscribeToControls(): void {
  //   const searchControl = this.filterForm.get('search');
  //   this.subscriptions.push(
  //     searchControl.valueChanges.subscribe((search: string) => {
  //       this.setLoading(true);
  //       this.searchSubject.next(search);
  //       this.searchMessage = '';
  //       if (searchControl.errors) {
  //         this.searchMessage = Object.keys(searchControl.errors)
  //           .map((key) => this.searchValidationMessages[key])
  //           .join(' ');
  //       }
  //     })
  //   );
  //   const sortControl = this.filterForm.get('sort');
  //   this.subscriptions.push(
  //     sortControl.valueChanges.subscribe((value: number) => {
  //       this.setLoading(true);
  //       this.sortSubject.next(+value);
  //     })
  //   );
  // }

  // private showSuccess(): void {
  //   const notification = {
  //     textOrTpl: this.successTpl,
  //     className: 'bg-success text-light',
  //     delay: 10000,
  //   } as INotification;
  //   this.notificationService.show(notification);
  // }

  ngOnDestroy(): void {
    // this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
