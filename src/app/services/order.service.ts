import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, delay, retry, shareReplay } from 'rxjs/operators';
import { IOrder } from '../types/order';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly baseUrl: string = 'http://localhost:3000';

  constructor(
    private readonly http: HttpClient,
    private readonly errorService: ErrorService
  ) {}

  getOrders(userId: number): Observable<IOrder[]> {
    return this.http
      .get<IOrder[]>(`${this.baseUrl}/orders?userId=${+userId}`)
      .pipe(
        delay(1000),
        shareReplay(1),
        retry(3),
        catchError(this.errorService.handleError)
      );
  }

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
}
