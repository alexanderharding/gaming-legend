import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import {
  NgbModal,
  NgbModalConfig,
  NgbTooltipConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

import { ICartItem } from '../../types/cart-item';
import { INotification } from '../../types/notification';
import { IShipping } from '../../types/shipping';
import { ShippingRatesResult } from '../../types/shipping-rates-result';

@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit {
  /* Page title */
  pageTitle = 'Review Cart';

  /* BehaviorSubject for displaying loading spinner */
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  /* Get data from resolver */
  private readonly resolvedData = this.route.snapshot.data
    .resolvedData as ShippingRatesResult;
  readonly shippingRates = this.resolvedData.shippingRates as IShipping[];
  readonly errorMessage = this.resolvedData.error as string;

  /* Get items$ from CartService */
  readonly items$ = this.cartService.cartItems$;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly title: Title,
    private readonly cartService: CartService,
    private readonly notificationService: NotificationService,
    private readonly modalService: NgbModal,
    private readonly ngbModalConfig: NgbModalConfig,
    private readonly ngbTooltipConfig: NgbTooltipConfig
  ) {}

  ngOnInit(): void {
    /* Config NgbModal settings */
    this.ngbModalConfig.centered = true;
    this.ngbModalConfig.backdrop = 'static';

    /* Config NgbTooltip settings */
    this.ngbTooltipConfig.openDelay = 300;
    this.ngbTooltipConfig.container = 'body';
    this.ngbTooltipConfig.placement = 'bottom';

    /* Set index.html title */
    if (this.errorMessage) {
      this.pageTitle = 'Retrieval Error';
    }
    this.title.setTitle(`Gaming Legend | ${this.pageTitle}`);
  }

  saveItem(item: ICartItem, quantity: number): void {
    if (quantity <= 0) {
      this.openRemoveModal(item);
      return;
    }
    this.setLoading(true);
    const updatedItem = {
      ...item,
      quantity,
    } as ICartItem;
    this.cartService.saveItem(updatedItem, 0).subscribe({
      error: () => {
        this.setLoading(false);
        this.show(
          `Error updating ${updatedItem.name} !`,
          'bg-danger text-light',
          15000
        );
      },
      complete: () => this.getCartItems(),
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

  private openRemoveModal(item: ICartItem): void {
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

  private show(
    textOrTpl: string | TemplateRef<any>,
    className: string,
    delay?: number
  ): void {
    const notification = {
      textOrTpl,
      className,
      delay,
    } as INotification;
    this.notificationService.show(notification);
  }

  private removeItem(item: ICartItem): void {
    this.setLoading(true);
    this.cartService.removeItem(item).subscribe({
      error: () => {
        this.show(
          `Error removing ${item.name} !`,
          'bg-danger text-light',
          15000
        );
        this.setLoading(false);
      },
      complete: () => this.getCartItems(),
    });
  }

  private removeAllItems(items: ICartItem[]): void {
    this.cartService.removeAllItems(items).subscribe({
      error: () => {
        this.show(`Error emptying cart !`, 'bg-danger text-light', 15000);
        this.setLoading(false);
      },
      complete: () => this.getCartItems(),
    });
  }

  private setLoading(value: boolean): void {
    this.loadingSubject.next(value);
  }

  private getCartItems(): void {
    this.cartService.getCartItems().subscribe({
      error: () => {
        this.show(`Error retrieving cart !`, 'bg-danger text-light', 15000);
        this.setLoading(false);
      },
      complete: () => this.setLoading(false),
    });
  }
}
