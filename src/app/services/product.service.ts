import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest } from 'rxjs';
import { catchError, delay, map, retry, shareReplay } from 'rxjs/operators';

import { IProduct } from '../types/product';
import { ProductBrandService } from './product-brand.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl: string = 'http://localhost:3000';

  constructor(
    private readonly http: HttpClient,
    private readonly productBrandService: ProductBrandService,
    private readonly errorService: ErrorService
  ) {}

  getProducts(type: string): Observable<IProduct[]> {
    const productType = type.toLowerCase().trim();
    return this.http.get<IProduct[]>(`${this.baseUrl}/${productType}`).pipe(
      delay(1000),
      map((products) =>
        products.map(
          (product) =>
            ({
              ...product,
              code: this.getCode(product, productType),
              starRating: this.getStarRating(),
              type: productType,
            } as IProduct)
        )
      ),
      retry(3),
      shareReplay(1),
      catchError(this.errorService.handleError)
    );
  }

  getProductWithBrand(type: string, id: number): Observable<IProduct> {
    return combineLatest([
      this.getProduct(type, id),
      this.productBrandService.getBrands(type),
    ]).pipe(
      map(
        ([product, brands]) =>
          ({
            ...product,
            brand: brands.find((b) => product.brandId === b.id).name,
          } as IProduct)
      ),
      shareReplay(1)
    );
  }

  private getProduct(type: string, id: number): Observable<IProduct> {
    const productType = type.toLowerCase().trim();
    return this.http
      .get<IProduct>(`${this.baseUrl}/${productType}/${+id}`)
      .pipe(
        delay(1000),
        map(
          (product) =>
            ({
              ...product,
              code: this.getCode(product, productType),
              starRating: this.getStarRating(),
              type: productType,
            } as IProduct)
        ),
        retry(3),
        shareReplay(1),
        catchError(this.errorService.handleError)
      );
  }

  private getStarRating(): number {
    return Math.ceil(Math.random() * 5);
  }

  private getCode(product: IProduct, type: string): string {
    return `${type.charAt(0).toUpperCase()}DN-${product.id}`;
  }
}
