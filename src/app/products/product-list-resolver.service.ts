import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { ProductService } from './product.service';
import { ProductListResult } from '../types/products-result';
import { combineLatest, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProductBrandService } from './product-brand.service';
import { IProduct } from '../types/product';

@Injectable({
  providedIn: 'root',
})
export class ProductListResolverService implements Resolve<ProductListResult> {
  constructor(
    private readonly productService: ProductService,
    private readonly productBrandService: ProductBrandService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ProductListResult> {
    const type = route.paramMap.get('type');

    return combineLatest([
      this.productService.getProducts(type),
      this.productBrandService.getBrands(type),
    ]).pipe(
      map(([p, brands]) => {
        const products = p.map(
          (product) =>
            ({
              ...product,
              brand: brands.find((b) => product.brandId === b.id).name,
            } as IProduct)
        ) as IProduct[];
        return { products, brands } as ProductListResult;
      }),
      catchError((error) =>
        of({
          products: null,
          brands: null,
          error: `Retrieval error: ${error}.`,
        } as ProductListResult)
      )
    );
  }
}
