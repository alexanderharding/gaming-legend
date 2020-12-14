import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { CartService } from '../services/cart.service';
import { CartItemsResult } from '../types/cart-items-result';

@Injectable({
  providedIn: 'root',
})
export class CartItemsResolverService implements Resolve<CartItemsResult> {
  constructor(private readonly cartService: CartService) {}

  resolve(): Observable<CartItemsResult> {
    return this.cartService.cartAction$.pipe(
      first(),
      map((items) => ({ items } as CartItemsResult)),
      catchError((error) => {
        return of({
          items: null,
          error: `Retrieval error: ${error}.`,
        } as CartItemsResult);
      })
    );
  }
}
