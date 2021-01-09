import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loadingAction$ = this.loadingSubject.asObservable();

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
  readonly items$ = this.cartService.cartAction$;
  readonly quantity$ = this.cartService.cartQuantity$;

  productName = '';

  constructor(
    private readonly cartService: CartService,
    private readonly shippingRateService: ShippingRateService,
    private readonly route: ActivatedRoute,
    private readonly modalService: NgbModal,
    private readonly config: NgbModalConfig,
    private readonly notificationService: NotificationService
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
    } else {
      this.setLoading(false);
      this.pageTitle = 'Retrieval Error';
    }
    /* Config NgbModal settings */
    this.config.centered = true;
    this.config.backdrop = 'static';
  }

  updateQty(item: ICartItem, amount: number): void {
    if (item.quantity <= 1 && amount === -1) {
      this.removeItem(item);
      return;
    }
    this.setLoading(true);
    const updatedItem = {
      ...item,
      quantity: item.quantity + amount,
    } as ICartItem;
    this.cartService.saveItem(updatedItem, 0).subscribe(
      (result) => {
        this.refreshCart();
      },
      (error) => {
        this.setLoading(false);
        console.error(error);
        this.showNotification(this.updateErrTpl);
      }
    );
  }

  removeItem(item: ICartItem): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    const instance = modalRef.componentInstance;
    instance.title = 'Remove Item';
    instance.message = `Are you sure you want to remove "${item.name}"?`;
    instance.warningMessage = 'This operation can not be undone.';
    instance.type = 'bg-danger';
    instance.closeMessage = 'remove';
    modalRef.closed.pipe(first()).subscribe(
      (result) => {
        this.setLoading(true);
        this.cartService.removeItem(item).subscribe(
          (result) => {
            this.refreshCart();
          },
          (error) => {
            this.setLoading(false);
            console.error(error);
            this.showNotification(this.removeErrTpl);
          }
        );
      },
      (error) => {}
    );
  }

  private showNotification(templateRef: TemplateRef<any>): void {
    const notification = {
      templateRef: templateRef,
      className: 'bg-danger text-light',
      delay: 15000,
    } as INotification;
    this.notificationService.show(notification);
  }

  private setLoading(value: boolean): void {
    this.loadingSubject.next(value);
  }

  private refreshCart(): void {
    this.cartService.setCurrentCart().subscribe({
      next: () => this.setLoading(false),
      error: (error) => {
        this.setLoading(false);
        console.error(error);
      },
    });
  }
}
