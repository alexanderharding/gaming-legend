import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ShippingRateService } from '../services/shipping-rate.service';
import { ShippingRatesResult } from '../types/shipping-rates-result';

@Injectable({
  providedIn: 'root',
})
export class ShippingRatesResolverService
  implements Resolve<ShippingRatesResult> {
  constructor(private readonly shippingRatesService: ShippingRateService) {}

  resolve(): Observable<ShippingRatesResult> {
    return this.shippingRatesService.shippingRates$.pipe(
      map((shippingRates) => ({ shippingRates } as ShippingRatesResult)),
      catchError((error) =>
        of({
          shippingRates: null,
          error: `Retrieval error: ${error}.`,
        } as ShippingRatesResult)
      )
    );
  }
}
