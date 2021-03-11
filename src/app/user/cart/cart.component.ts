import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
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
import { BehaviorSubject, Subscription } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';

import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

import { ICartItem } from '../../types/cart-item';
import { INotification } from '../../types/notification';
import { IShipping } from '../../types/shipping';
import { ShippingRatesResult } from '../../types/shipping-rates-result';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';

@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit, OnDestroy {
  cartForm: FormGroup;
  private readonly subscriptions: Subscription[] = [];
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

  private readonly quantitiesSubject = new BehaviorSubject<FormArray>(null);
  readonly quantities$ = this.quantitiesSubject.asObservable();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly title: Title,
    private readonly cartService: CartService,
    private readonly notificationService: NotificationService,
    private readonly modalService: NgbModal,
    private readonly ngbModalConfig: NgbModalConfig,
    private readonly ngbTooltipConfig: NgbTooltipConfig,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cartForm = this.fb.group({
      quantities: this.fb.array([]),
    });
    this.quantitiesSubject.next(this.cartForm.get('quantities') as FormArray);
    this.items$
      .pipe(first())
      .subscribe((items) => this.buildFormArray(this.cartForm, items));
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

  openDeleteAllModal(items: ICartItem[]): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    const instance = modalRef.componentInstance;
    instance.title = 'Empty Cart';
    instance.message = `Are you sure you want to empty the cart?`;
    instance.warningMessage = 'This can not be undone.';
    instance.type = 'bg-danger';
    instance.closeMessage = 'empty';
    modalRef.closed.pipe(first()).subscribe({
      error: () => {},
      complete: () => {
        this.setLoading(true);
        this.deleteAllItems(items);
      },
    });
  }

  private saveItem(item: ICartItem, index: number): void {
    this.cartService.saveItem(item, index).subscribe({
      error: () => {
        this.setLoading(false);
        this.show(
          `Error updating ${item.name} !`,
          'bg-danger text-light',
          15000
        );
      },
      complete: () => this.setLoading(false),
    });
  }

  private deleteItem(item: ICartItem, index: number): void {
    this.cartService.deleteItem(item).subscribe({
      error: () => {
        this.show(
          `Error removing ${item.name} !`,
          'bg-danger text-light',
          15000
        );
        this.setLoading(false);
      },
      complete: () => {
        this.removeControlAtIndex(index);
        this.setLoading(false);
      },
    });
  }

  private deleteAllItems(items: ICartItem[]): void {
    this.cartService.deleteAllItems(items).subscribe({
      next: () => this.removeControlAtIndex(0),
      error: () => {
        this.show(`Error emptying cart !`, 'bg-danger text-light', 15000);
        this.setLoading(false);
      },
      complete: () => this.setLoading(false),
    });
  }

  private buildFormArray(form: FormGroup, items: ICartItem[]): void {
    const quantitiesArray = form.get('quantities') as FormArray;
    items.forEach((i) => {
      quantitiesArray.push(
        this.fb.group({
          id: +i.id,
          quantity: +i.quantity,
        })
      );
      const quantityControl = quantitiesArray.get(
        `${quantitiesArray.length - 1}`
      ) as AbstractControl;
      this.subscriptions.push(
        quantityControl.valueChanges
          .pipe(
            switchMap((value) => {
              this.setLoading(true);
              const id = +value.id;
              const quantity = +value.quantity;
              return this.items$.pipe(
                first(),
                tap((items) => {
                  const index = items.findIndex((i) => +i.id === +id);
                  const item = {
                    ...items[index],
                    quantity,
                  } as ICartItem;
                  quantity
                    ? this.saveItem(item, index)
                    : this.deleteItem(item, index);
                })
              );
            })
          )
          .subscribe()
      );
    });
  }

  private removeControlAtIndex(index: number): void {
    const quantitiesArray = this.cartForm.get('quantities') as FormArray;
    this.subscriptions[index].unsubscribe();
    this.subscriptions.splice(index, 1);
    quantitiesArray.removeAt(index);
  }

  private setLoading(value: boolean): void {
    this.loadingSubject.next(value);
    this.toggleDisabled(this.cartForm, value);
  }

  private toggleDisabled(form: FormGroup, value: boolean): void {
    value
      ? form.disable({ emitEvent: false })
      : form.enable({ emitEvent: false });
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
