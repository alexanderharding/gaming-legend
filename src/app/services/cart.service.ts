import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { catchError, delay, map, retry, tap } from 'rxjs/operators';

import { ICartItem } from '../types/cart-item';
import { ErrorService } from './error.service';
import { ShippingRateService } from './shipping-rate.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly baseUrl: string = 'http://localhost:3000';

  tax = 0.0687;
  // items: ICartItem[];

  constructor(
    private readonly http: HttpClient,
    private readonly shippingRateService: ShippingRateService,

    private readonly errorService: ErrorService
  ) {
    // this.items = this.getItems();
  }

  private readonly cartSubject = new BehaviorSubject<ICartItem[]>([]);
  readonly cartAction$ = this.cartSubject.asObservable();

  setCurrentCart(): Observable<boolean> {
    return this.http.get<ICartItem[]>(`${this.baseUrl}/cart`).pipe(
      delay(1000),
      retry(3),
      map((items) => {
        this.cartSubject.next(items);
        return true;
      }),
      catchError(this.errorService.handleError)
    );
  }

  cartQuantity$ = this.cartAction$.pipe(
    map((items) =>
      items.reduce((prev, current) => {
        return +prev + +current.quantity;
      }, 0)
    )
  );

  subtotal$ = this.cartAction$.pipe(
    map((items) =>
      items.reduce((prev, current) => {
        return +(prev + +current.price * +current.quantity).toFixed(2);
      }, 0)
    )
  );

  totalTax$ = this.subtotal$.pipe(
    map((subtotal) => +(subtotal * this.tax).toFixed(2))
  );

  total$ = combineLatest([
    this.subtotal$,
    this.totalTax$,
    this.shippingRateService.shippingPriceSelectedAction$,
  ]).pipe(
    map(
      ([subtotal, totalTax, shippingPrice]) =>
        +(subtotal + totalTax + shippingPrice).toFixed(2)
    )
  );

  saveItem(item: ICartItem, index: number): Observable<ICartItem> {
    return +index < 0 ? this.addItem(item) : this.updateItem(item);
  }

  removeItem(item: ICartItem): Observable<ICartItem> {
    return this.http
      .delete<ICartItem>(`${this.baseUrl}/cart/${item.id}`)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  private addItem(item: ICartItem): Observable<ICartItem> {
    return this.http
      .post<ICartItem>(`${this.baseUrl}/cart`, item)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  private updateItem(item: ICartItem): Observable<ICartItem> {
    return this.http
      .put<ICartItem>(`${this.baseUrl}/cart/${+item.id}`, item)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  // private getItems(): ICartItem[] {
  //   const itemsStored = JSON.parse(
  //     localStorage.getItem('items')
  //   ) as ICartItem[];
  //   return itemsStored ? itemsStored : [];
  // }

  // getTotalTax(): number {
  //   const subtotal = this.getSubtotal();
  //   return subtotal * this.tax;
  // }

  // getSubtotal(): number {
  //   return this.items.reduce((prev, current) => {
  //     return prev + +current.price * +current.quantity;
  //   }, 0);
  // }

  // getTotal(shippingRate: number): number {
  //   const total = this.getTotalTax() + this.getSubtotal() + shippingRate;
  //   return +total.toFixed(2);
  // }

  // getTotalQty(): number {
  //   return this.items.reduce((prev, current) => {
  //     return +prev + +current.quantity;
  //   }, 0);
  // }

  // updateCart(item: ICartItem): void {
  //   const index = this.getIndex(item);
  //   index === -1 ? this.addToCart(item) : this.updateQty(item, index);
  // }

  // removeItem(item: ICartItem): void {
  //   const index = this.getIndex(item);
  //   if (this.items.length > 1) {
  //     this.items.splice(index, 1);
  //     this.saveItems();
  //   } else {
  //     this.clearCart();
  //   }
  // }

  // clearCart(): void {
  //   localStorage.removeItem('items');
  //   this.items = [];
  // }

  // private addToCart(item: ICartItem): void {
  //   this.items.push(item);
  //   this.saveItems();
  // }

  // private updateQty(item: ICartItem, index: number): void {
  //   this.items.splice(index, 1, item);
  //   this.saveItems();
  // }

  // private saveItems(): void {
  //   localStorage.setItem('items', JSON.stringify(this.items));
  // }

  // private getIndex(item: ICartItem): number {
  //   return +this.items.findIndex(({ id }) => id === item.id);
  // }
}
