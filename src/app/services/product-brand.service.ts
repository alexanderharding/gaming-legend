import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, retry, shareReplay } from 'rxjs/operators';
import { IProductBrand } from '../types/product-brand';
import { ErrorService } from '../core/error.service';

@Injectable({
  providedIn: 'root',
})
export class ProductBrandService {
  private readonly baseUrl: string = 'http://localhost:3000';

  constructor(
    private readonly http: HttpClient,
    private readonly errorService: ErrorService
  ) {}

  getBrands(type: string): Observable<IProductBrand[]> {
    const productType = type.toLowerCase().trim();
    return this.http
      .get<IProductBrand[]>(`${this.baseUrl}/${productType}Brands`)
      .pipe(
        shareReplay(1),
        retry(3),
        catchError(this.errorService.handleError)
      );
  }
}
