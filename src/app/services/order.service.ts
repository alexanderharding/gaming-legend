import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import {
  catchError,
  delay,
  first,
  retry,
  shareReplay,
  switchMap,
  take,
} from 'rxjs/operators';
import { IOrder } from '../types/order';
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
    switchMap((user) => this.getOrders(user.id)),
    catchError((err) => {
      console.error(err);
      return EMPTY;
    })
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

  saveOrder(order: IOrder, index: number): Observable<IOrder> {
    return +index < 0 ? this.addOrder(order) : this.updateOrder(order);
  }

  private addOrder(order: IOrder): Observable<IOrder> {
    return this.http
      .post<IOrder>(`${this.baseUrl}/order`, order)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  private updateOrder(order: IOrder): Observable<IOrder> {
    return this.http
      .put<IOrder>(`${this.baseUrl}/order/${+order.id}`, order)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  private getOrders(id: number): Observable<IOrder[]> {
    return this.http
      .get<IOrder[]>(`${this.baseUrl}/orders?userId=${+id}`)
      .pipe(
        delay(1000),
        shareReplay(1),
        retry(3),
        catchError(this.errorService.handleError)
      );
  }
}
