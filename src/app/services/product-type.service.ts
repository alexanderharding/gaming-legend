import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import {
  catchError,
  delay,
  map,
  retry,
  shareReplay,
  tap,
} from 'rxjs/operators';
import { IProductType } from '../types/product-type';
import { ErrorService } from '../core/error.service';

@Injectable({
  providedIn: 'root',
})
export class ProductTypeService {
  private readonly baseUrl: string = 'http://localhost:3000';

  constructor(
    private readonly http: HttpClient,
    private readonly errorService: ErrorService
  ) {}

  getTypes(): Observable<IProductType[]> {
    return this.http.get<IProductType[]>(`${this.baseUrl}/types`).pipe(
      delay(1000),
      tap((type) => type as IProductType[]),
      shareReplay(1),
      retry(3),
      catchError(this.errorService.handleError)
    );
  }
}
