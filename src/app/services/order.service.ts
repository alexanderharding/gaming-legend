import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import {
  catchError,
  delay,
  first,
  map,
  retry,
  shareReplay,
  switchMap,
  take,
} from 'rxjs/operators';
import { IOrder, Order } from '../types/order';
import { AuthService } from './auth.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly baseUrl: string = 'http://localhost:3000';

  private readonly user$ = this.authService.currentUser$;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly errorService: ErrorService
  ) {}

  orders$ = this.user$.pipe(
    first(),
    switchMap((user) => this.getOrders(user.id))
  );

  getOrder(id: number): Observable<IOrder[]> {
    return this.http
      .get<IOrder[]>(`${this.baseUrl}/orders/${+id}`)
      .pipe(
        delay(1000),
        shareReplay(1),
        retry(3),
        catchError(this.errorService.handleError)
      );
  }

  saveOrder(order: Order): Observable<IOrder> {
    return +order.id ? this.updateOrder(order as IOrder) : this.addOrder(order);
  }

  private addOrder(order: Order): Observable<IOrder> {
    return this.http
      .post<IOrder>(`${this.baseUrl}/orders`, order)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  private updateOrder(order: IOrder): Observable<IOrder> {
    return this.http
      .put<IOrder>(`${this.baseUrl}/orders/${+order.id}`, order)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  private getOrders(id: number): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.baseUrl}/orders?userId=${+id}`).pipe(
      delay(1000),
      map((orders) =>
        orders.sort((a, b) => +new Date(b.date) - +new Date(a.date))
      ),
      shareReplay(1),
      retry(3),
      catchError(this.errorService.handleError)
    );
  }
}
