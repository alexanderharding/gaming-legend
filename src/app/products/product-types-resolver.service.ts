import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductTypeService } from './product-type.service';
import { ProductTypesResult } from '../types/product-types-result';

@Injectable({
  providedIn: 'root',
})
export class ProductTypesResolverService
  implements Resolve<ProductTypesResult> {
  constructor(private readonly productTypeService: ProductTypeService) {}

  resolve(): Observable<ProductTypesResult> {
    return this.productTypeService.getTypes().pipe(
      map((productTypes) => ({ productTypes } as ProductTypesResult)),
      catchError((error) =>
        of({
          productTypes: null,
          error: `Retrieval error: ${error}.`,
        } as ProductTypesResult)
      )
    );
  }
}
