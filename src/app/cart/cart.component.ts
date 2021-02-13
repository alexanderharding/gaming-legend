import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

import { CartService } from '../services/cart.service';
import { NotificationService } from '../services/notification.service';
import { ShippingRateService } from '../services/shipping-rate.service';

import { ICartItem } from '../types/cart-item';
import { INotification } from '../types/notification';
import { IShipping } from '../types/shipping';
import { ShippingRatesResult } from '../types/shipping-rates-result';

@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit {
  @ViewChild('updateErrTpl') private updateErrTpl: TemplateRef<any>;
  @ViewChild('removeErrTpl') private removeErrTpl: TemplateRef<any>;
  @ViewChild('clearDangerTpl') private clearDangerTpl: TemplateRef<any>;
  @ViewChild('getCartErrTpl') private getCartErrTpl: TemplateRef<any>;

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  /* Get data from resolver */
  private readonly resolvedData = this.route.snapshot.data
    .resolvedData as ShippingRatesResult;
  readonly shippingRates = this.resolvedData.shippingRates as IShipping[];
  readonly errorMessage = this.resolvedData.error as string;

  /* Latest and earliest arrival date */
  earliestArrival: Date;
  latestArrival: Date;

  /* Page title */
  pageTitle = 'Cart';

  /* Get data from CartService */
  readonly items$ = this.cartService.cartItems$;
  readonly quantity$ = this.cartService.cartQuantity$;

  constructor(
    private readonly cartService: CartService,
    private readonly shippingRateService: ShippingRateService,
    private readonly route: ActivatedRoute,
    private readonly modalService: NgbModal,
    private readonly config: NgbModalConfig,
    private readonly notificationService: NotificationService,
    private readonly title: Title
  ) {}

  ngOnInit(): void {
    if (this.shippingRates) {
      this.shippingRateService.setShipping(this.shippingRates[0].price);
      const length = this.shippingRates.length;
      const fastestRate = this.shippingRates[length - 1].rate;
      const slowestRate = this.shippingRates[0].rate;
      this.earliestArrival = this.shippingRateService.getDeliveryDate(
        +fastestRate
      );
      this.latestArrival = this.shippingRateService.getDeliveryDate(
        +slowestRate
      );
      /* Config NgbModal settings */
      this.config.centered = true;
      this.config.backdrop = 'static';
    } else {
      this.pageTitle = 'Retrieval Error';
    }
    this.title.setTitle(`Gaming Legend | ${this.pageTitle}`);
  }

  saveItem(item: ICartItem, amount: number): void {
    if (item.quantity <= 1 && amount === -1) {
      this.openRemoveModal(item);
      return;
    }
    this.setLoading(true);
    const updatedItem = {
      ...item,
      quantity: item.quantity + amount,
    } as ICartItem;
    this.cartService.saveItem(updatedItem, 0).subscribe({
      error: (err) => {
        this.setLoading(false);
        console.error(err);
        this.showDanger(this.updateErrTpl);
      },
      complete: () => this.getCartItems(),
    });
  }

  openRemoveModal(item: ICartItem): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    const instance = modalRef.componentInstance;
    instance.title = 'Remove Item';
    instance.message = `Are you sure you want to remove "${item.name}"?`;
    instance.warningMessage = 'This operation can not be undone.';
    instance.type = 'bg-danger';
    instance.closeMessage = 'remove';
    modalRef.closed.pipe(first()).subscribe({
      error: () => {},
      complete: () => this.removeItem(item),
    });
  }

  openRemoveAllModal(items: ICartItem[]): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    const instance = modalRef.componentInstance;
    instance.title = 'Empty Cart';
    instance.message = `Are you sure you want to empty the cart?`;
    instance.warningMessage = 'This operation can not be undone.';
    instance.type = 'bg-danger';
    instance.closeMessage = 'empty';
    modalRef.closed.pipe(first()).subscribe({
      error: () => {},
      complete: () => {
        this.setLoading(true);
        this.removeAllItems(items);
      },
    });
  }

  private removeItem(item: ICartItem): void {
    this.setLoading(true);
    this.cartService.removeItem(item).subscribe({
      error: () => {
        this.showDanger(this.removeErrTpl);
        this.setLoading(false);
      },
      complete: () => this.getCartItems(),
    });
  }

  private removeAllItems(items: ICartItem[]): void {
    this.cartService.removeAllItems(items).subscribe({
      error: () => {
        this.showDanger(this.clearDangerTpl);
        this.setLoading(false);
      },
      complete: () => this.getCartItems(),
    });
  }

  private showDanger(templateRef: TemplateRef<any>): void {
    const notification = {
      textOrTpl: templateRef,
      className: 'bg-danger text-light',
      delay: 15000,
    } as INotification;
    this.notificationService.show(notification);
  }

  private setLoading(value: boolean): void {
    this.loadingSubject.next(value);
  }

  private getCartItems(): void {
    this.cartService.getCartItems().subscribe({
      error: () => {
        this.showDanger(this.getCartErrTpl);
        this.setLoading(false);
      },
      complete: () => this.setLoading(false),
    });
  }
}
