import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  asyncScheduler,
  BehaviorSubject,
  combineLatest,
  Observable,
  scheduled,
} from 'rxjs';
import {
  catchError,
  concatAll,
  delay,
  first,
  map,
  retry,
  tap,
} from 'rxjs/operators';

import { ICartItem } from '../types/cart-item';
import { INotification } from '../types/notification';
import { ErrorService } from './error.service';
import { NotificationService } from './notification.service';
import { ShippingRateService } from './shipping-rate.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private readonly http: HttpClient,
    private readonly shippingRateService: ShippingRateService,
    private readonly notificationService: NotificationService,
    private readonly errorService: ErrorService
  ) {
    this.getCartItems().subscribe({
      error: () => {
        const notification = {
          textOrTpl: 'Cart retrieval error !',
          className: 'bg-danger text-light',
          delay: 15000,
        } as INotification;
        this.notificationService.show(notification);
      },
    });
  }

  private readonly baseUrl: string = 'http://localhost:3000';
  private readonly cartItemsSubject = new BehaviorSubject<ICartItem[]>([]);
  private readonly tax = 0.0687;
  readonly cartItems$ = this.cartItemsSubject.asObservable();
  readonly itemMaxQty = 5;

  readonly cartQuantity$ = this.cartItems$.pipe(
    map((items) =>
      items.reduce((prev, current) => {
        return +prev + +current.quantity;
      }, 0)
    )
  );
  readonly subtotal$ = this.cartItems$.pipe(
    map((items) =>
      items.reduce((prev, current) => {
        return +(prev + +current.price * +current.quantity).toFixed(2);
      }, 0)
    )
  );
  readonly totalTax$ = this.subtotal$.pipe(
    map((subtotal) => +(subtotal * this.tax).toFixed(2))
  );
  readonly total$ = combineLatest([
    this.subtotal$,
    this.totalTax$,
    this.shippingRateService.shippingPriceSelectedAction$,
  ]).pipe(
    map(
      ([subtotal, totalTax, shippingPrice]) =>
        +(subtotal + totalTax + shippingPrice).toFixed(2)
    )
  );

  readonly quantityOptions = this.getQuantityOptions();

  saveItem(item: ICartItem, index: number): Observable<ICartItem> {
    return +index >= 0 ? this.updateItem(item, +index) : this.addItem(item);
  }

  deleteItem(item: ICartItem): Observable<ICartItem> {
    return combineLatest([this.delete(item), this.cartItems$]).pipe(
      first(),
      map(([deletedItem, cartItems]) => {
        const items = cartItems.filter(
          ({ id }) => +id !== +item.id
        ) as ICartItem[];
        this.setCartItems(items);
        return deletedItem as ICartItem;
      })
    );
  }

  deleteAllItems(items: ICartItem[]): Observable<unknown> {
    const array: Observable<ICartItem>[] = [];
    items.forEach((i) => array.push(this.deleteItem(i)));
    return scheduled(array, asyncScheduler).pipe(concatAll());
  }

  private addItem(item: ICartItem): Observable<ICartItem> {
    return combineLatest([this.post(item), this.cartItems$]).pipe(
      first(),
      map(([addedItem, cartItems]) => {
        const items = [...cartItems] as ICartItem[];
        items.push(addedItem);
        this.setCartItems(items);
        return addedItem as ICartItem;
      })
    );
  }

  private updateItem(item: ICartItem, index: number): Observable<ICartItem> {
    return combineLatest([this.put(item), this.cartItems$]).pipe(
      first(),
      map(([updatedItem, cartItems]) => {
        const items = [...cartItems] as ICartItem[];
        items.splice(index, 1, updatedItem);
        this.setCartItems(items);
        return updatedItem as ICartItem;
      })
    );
  }

  private getCartItems(): Observable<ICartItem[]> {
    return this.http.get<ICartItem[]>(`${this.baseUrl}/cart`).pipe(
      delay(1000),
      retry(3),
      tap((items) => this.cartItemsSubject.next(items)),
      catchError(this.errorService.handleError)
    );
  }

  private post(item: ICartItem): Observable<ICartItem> {
    return this.http
      .post<ICartItem>(`${this.baseUrl}/cart`, item)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  private put(item: ICartItem): Observable<ICartItem> {
    return this.http
      .put<ICartItem>(`${this.baseUrl}/cart/${+item.id}`, item)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  private delete(item: ICartItem): Observable<ICartItem> {
    return this.http
      .delete<ICartItem>(`${this.baseUrl}/cart/${item.id}`)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  private setCartItems(items: ICartItem[]): void {
    this.cartItemsSubject.next(items);
  }

  private getQuantityOptions(): number[] {
    const options: number[] = [];
    for (let i = 0; i <= this.itemMaxQty; i++) {
      options.push(i);
    }
    return options;
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
