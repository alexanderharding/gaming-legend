import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProductBrandService } from '../products/product-brand.service';
import { ProductBrandsResult } from '../types/product-brands-result';

@Injectable({
  providedIn: 'root',
})
export class ProductBrandsResolverService
  implements Resolve<ProductBrandsResult> {
  constructor(private readonly brandService: ProductBrandService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ProductBrandsResult> {
    const type = route.paramMap.get('type');
    return this.brandService.getBrands(type).pipe(
      map((brands) => ({ brands } as ProductBrandsResult)),
      catchError((error) =>
        of({
          brands: null,
          error: `Retrieval error: ${error}.`,
        } as ProductBrandsResult)
      )
    );
  }
}
