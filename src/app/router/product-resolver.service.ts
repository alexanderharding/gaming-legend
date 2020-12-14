import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';

import { ProductService } from '../services/product.service';
import { map, catchError } from 'rxjs/operators';
import { ProductResult } from '../types/product-result';

@Injectable({
  providedIn: 'root',
})
export class ProductResolverService implements Resolve<ProductResult> {
  constructor(private readonly productService: ProductService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ProductResult> {
    const type = route.paramMap.get('type').toLocaleLowerCase();
    const id = route.paramMap.get('id');

    if (isNaN(+id)) {
      return of({
        product: null,
        error: `Retrieval error: This product id is not a number: ${id}.`,
      } as ProductResult);
    }
    return this.productService.getProductWithBrand(type, +id).pipe(
      map((product) => ({ product } as ProductResult)),

      catchError((error) =>
        of({
          product: null,
          error: `Retrieval error: ${error}.`,
        } as ProductResult)
      )
    );
  }
}
