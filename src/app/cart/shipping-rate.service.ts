import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, retry } from 'rxjs/operators';
import { IShipping } from '../types/shipping';
import { BehaviorSubject, Observable } from 'rxjs';
import { ErrorService } from '../core/error.service';

@Injectable({
  providedIn: 'root',
})
export class ShippingRateService {
  constructor(
    private readonly http: HttpClient,
    private readonly errorService: ErrorService
  ) {}

  private readonly baseUrl: string = 'http://localhost:3000';

  readonly shippingDeadline: number = 23;

  private readonly shippingPriceSelectedSubject = new BehaviorSubject<number>(
    null
  );
  readonly shippingPriceSelectedAction$ = this.shippingPriceSelectedSubject.asObservable();

  shippingRates$ = this.http
    .get<IShipping[]>(`${this.baseUrl}/shipping`)
    .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));

  setShipping(price: number): void {
    this.shippingPriceSelectedSubject.next(+price);
  }

  getShippingRate(id: number): Observable<IShipping> {
    return this.http
      .get<IShipping>(`${this.baseUrl}/shipping/${+id}`)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  getDeliveryDate(totalDays: number): Date {
    const today = new Date();
    const sunday = 0;
    const saturday = 6;

    if (
      today.getUTCHours() >= this.shippingDeadline &&
      today.getDay() !== sunday &&
      today.getDay() !== saturday
    ) {
      /* If today.getUTCHours() is geater than or equal to 23 & if it's NOT
      weekend day we increase the totalDays by 1 */
      totalDays++;
    }

    let deliveryDate = today;

    for (let days = 1; days <= totalDays; days++) {
      deliveryDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
      if (
        deliveryDate.getDay() === sunday ||
        deliveryDate.getDay() === saturday
      ) {
        /* If it's a weekend day we increase the totalDays by 1 */
        totalDays++;
      }
    }
    return deliveryDate;
  }
}
