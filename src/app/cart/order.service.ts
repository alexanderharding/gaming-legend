import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import {
  catchError,
  delay,
  first,
  map,
  retry,
  shareReplay,
  switchMap,
  take,
} from 'rxjs/operators';
import { IOrder, Order, OrderMaker } from '../types/order';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../core/error.service';
import { FormGroup } from '@angular/forms';
import { ICartItem } from '../types/cart-item';
import { Customer, CustomerMaker } from '../types/customer';
import { Payment, PaymentMaker } from '../types/payment';
import { CartService } from '../core/cart.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly baseUrl: string = 'http://localhost:3000';

  // private readonly user$ = this.authService.currentUser$;

  constructor(
    private readonly http: HttpClient,
    private readonly cartService: CartService,
    private readonly errorService: ErrorService
  ) {}

  // orders$ = this.user$.pipe(
  //   first(),
  //   switchMap((user) => this.getOrders(user.id))
  // );

  getOrder(id: number): Observable<IOrder[]> {
    return this.http
      .get<IOrder[]>(`${this.baseUrl}/orders/${+id}`)
      .pipe(
        delay(1000),
        shareReplay(1),
        retry(3),
        catchError(this.errorService.handleError)
      );
  }

  saveOrder(order: Order): Observable<IOrder> {
    return +order.id ? this.updateOrder(order as IOrder) : this.addOrder(order);
  }

  buildOrder(form: FormGroup): Observable<Order> {
    return combineLatest([
      this.cartService.total$,
      this.cartService.cartItems$,
    ]).pipe(
      first(),
      map(([total, items]) => this.createOrder(form, items, total))
    );
  }

  private addOrder(order: Order): Observable<IOrder> {
    return this.http
      .post<IOrder>(`${this.baseUrl}/orders`, order)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  private updateOrder(order: IOrder): Observable<IOrder> {
    return this.http
      .put<IOrder>(`${this.baseUrl}/orders/${+order.id}`, order)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  private getOrders(id: number): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.baseUrl}/orders?userId=${+id}`).pipe(
      delay(1000),
      map((orders) =>
        orders.sort((a, b) => +new Date(b.date) - +new Date(a.date))
      ),
      shareReplay(1),
      retry(3),
      catchError(this.errorService.handleError)
    );
  }

  private createOrder(
    form: FormGroup,
    items: ICartItem[],
    total: number
  ): Order {
    return OrderMaker.create({
      customer: this.createCustomer(form),
      items,
      payment: this.createPayment(form, total),
      date: new Date().toString(),
      status: 'pending',
    }) as Order;
  }

  private createCustomer(form: FormGroup): Customer {
    return CustomerMaker.create({
      firstName: form.get('nameGroup.firstName').value as string,
      lastName: form.get('nameGroup.lastName').value as string,
      phone: form.get('contactGroup.phone').value as string,
      email: form.get('contactGroup.email').value as string,
      street: form.get('addressGroup.street').value as string,
      street2: form.get('addressGroup.street2').value as string,
      city: form.get('addressGroup.city').value as string,
      state: form.get('addressGroup.state').value as string,
      zip: form.get('addressGroup.zip').value as string,
      country: form.get('addressGroup.country').value as string,
    }) as Customer;
  }

  private createPayment(form: FormGroup, total: number): Payment {
    return PaymentMaker.create({
      cardNumber: +form.get('paymentGroup.cardNumber').value,
      cvv: +form.get('paymentGroup.cvv').value,
      expiration: form.get('paymentGroup.expiration').value as string,
      total,
    }) as Payment;
  }
}
