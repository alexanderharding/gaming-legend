import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { listAnimation } from '../app.animation';

import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

import { CartService } from '../services/cart.service';
import { ShippingRateService } from '../services/shipping-rate.service';

import { ICartItem } from '../types/cart-item';
import { IShippingRate } from '../types/shipping-rate';
import { ShippingRatesResult } from '../types/shipping-rates-result';

@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  animations: [listAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit {
  /* Get data from resolver */
  private readonly resolvedData = this.route.snapshot.data
    .resolvedData as ShippingRatesResult;
  readonly shippingRates = this.resolvedData.shippingRates as IShippingRate[];
  readonly errorMessage = this.resolvedData.error as string;

  /* Latest and earliest arrival date */
  earliestArrival: Date;
  latestArrival: Date;

  /* Page title */
  pageTitle = 'Cart';

  /* Get data from CartService */
  readonly tax = +this.cartService.tax;
  readonly items$ = this.cartService.cartAction$;
  readonly quantity$ = this.cartService.cartQuantity$;
  readonly subtotal$ = this.cartService.subtotal$;
  readonly totalTax$ = this.cartService.totalTax$;
  readonly total$ = this.cartService.total$.pipe(
    tap(() => (this.loading = false))
  );
  readonly shippingPrice$ = this.cartService.shippingSelectedAction$;

  loading = false;

  constructor(
    private readonly cartService: CartService,
    private readonly shippingRateService: ShippingRateService,
    private readonly route: ActivatedRoute,
    private readonly modalService: NgbModal,
    private readonly config: NgbModalConfig
  ) {}

  ngOnInit(): void {
    if (this.shippingRates) {
      this.cartService.setShipping(this.shippingRates[0].price);
      const length = this.shippingRates.length;
      const earliestRate = this.shippingRates[length - 1].rate;
      const latestRate = this.shippingRates[0].rate;
      this.earliestArrival = this.shippingRateService.getDeliveryDate(
        earliestRate
      );
      this.latestArrival = this.shippingRateService.getDeliveryDate(latestRate);
    } else {
      this.loading = false;
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
    this.loading = true;
    const updatedItem = {
      ...item,
      quantity: item.quantity + amount,
    } as ICartItem;
    this.cartService.saveItem(updatedItem, 0).subscribe(
      (result) => {
        this.refreshCart();
      },
      (error) => {
        this.loading = false;
        console.error(error);
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
    modalRef.result.then(
      (result) => {
        this.loading = true;
        this.cartService.removeItem(item).subscribe(
          (result) => {
            this.refreshCart();
          },
          (error) => {
            this.loading = false;
            console.error(error);
          }
        );
      },
      (reason) => {}
    );
  }

  emptyCart(items: ICartItem[]): void {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      backdrop: 'static',
    });
    const instance = modalRef.componentInstance;
    instance.title = 'Empty Cart';
    instance.message = 'Are you sure you want to empty your cart?';
    instance.warningMessage = 'This operation can not be undone.';
    instance.type = 'bg-danger';
    instance.closeMessage = 'empty';
    modalRef.result.then(
      (result) => {
        this.loading = true;
        // console.log(items);
        items.forEach((item) => {
          this.cartService.removeItem(item).subscribe(
            (result) => {},
            (error) => {
              console.error(error);
              this.loading = false;
            }
          );
        });
        this.refreshCart();
      },
      (reason) => {}
    );
  }

  setLoading(value: boolean): void {
    this.loading = value;
  }

  private refreshCart(): void {
    this.cartService.setCurrentCart().subscribe({
      error: (error) => {
        this.loading = false;
        console.error(error);
      },
    });
  }
}
