import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OrderService } from '../services/order.service';
import { OrdersResult } from '../types/orders-result';

@Injectable({
  providedIn: 'root',
})
export class OrdersResolverService {
  constructor(private readonly orderService: OrderService) {}

  // resolve(): Observable<OrdersResult> {
  //   return this.orderService.orders$.pipe(
  //     map((orders) => ({ orders } as OrdersResult)),
  //     catchError((error) =>
  //       of({
  //         orders: null,
  //         error: `Retrieval error: ${error}.`,
  //       } as OrdersResult)
  //     )
  //   );
  // }
}
