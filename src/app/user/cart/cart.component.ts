import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';

/* Router */
import { ActivatedRoute } from '@angular/router';

/* Rxjs */
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';

/* Components */
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

/* Services */
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

/* Title */
import { Title } from '@angular/platform-browser';

/* NgbModal */
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

/* Forms */
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';

/* Interfaces */
import { ICartItem } from '../../types/cart-item';
import { INotification } from '../../types/notification';
import { IShipping } from '../../types/shipping';

/* Classes */
import { ShippingRatesResult } from '../../types/shipping-rates-result';

@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit, OnDestroy {
  pageTitle = 'Review Cart';
  cartForm: FormGroup;

  /* BehaviorSubject for displaying loading spinner */
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  /* Get data from resolver */
  private readonly resolvedData = this.route.snapshot.data
    .resolvedData as ShippingRatesResult;
  readonly shippingRates = this.resolvedData.shippingRates as IShipping[];
  readonly errorMessage = this.resolvedData.error as string;

  /* Get data from CartService */
  readonly items$: Observable<ICartItem[]> = this.cartService.cartItems$;
  readonly quantityOptions: number[] = this.cartService.getQuantityOptions();

  /* BehaviorSubject for displaying quantities FormArray */
  private readonly quantitiesSubject = new BehaviorSubject<FormArray>(null);
  readonly quantities$ = this.quantitiesSubject.asObservable();

  /* For storing and cleaning up subscriptions onDestroy */
  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly title: Title,
    private readonly cartService: CartService,
    private readonly notificationService: NotificationService,
    private readonly modalService: NgbModal,
    private readonly ngbModalConfig: NgbModalConfig,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.shippingRates
      ? this.onShippingRatesReceived()
      : this.onErrorReceived();
    this.title.setTitle(`Gaming Legend | ${this.pageTitle}`);
  }

  openDeleteModal(item: ICartItem, items: ICartItem[]): void {
    const index = items.findIndex(({ id }) => +id === +item.id);
    const modalRef = this.modalService.open(ConfirmModalComponent);
    const instance = modalRef.componentInstance;
    instance.message = `Are you sure you want remove "${item.name}" from the
    cart?`;
    instance.closeMessage = 'Remove';
    modalRef.closed.pipe(first()).subscribe({
      error: () => {},
      complete: () => {
        this.setLoading(true);
        this.deleteItem(item, +index);
      },
    });
  }

  openDeleteAllModal(items: ICartItem[]): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    const instance = modalRef.componentInstance;
    instance.message = `Are you sure you want to empty the cart?`;
    instance.closeMessage = 'Empty';
    modalRef.closed.pipe(first()).subscribe({
      error: () => {},
      complete: () => {
        this.setLoading(true);
        this.deleteAllItems(items);
      },
    });
  }

  private onShippingRatesReceived(): void {
    /* Build cartForm FormGroup */
    this.cartForm = this.fb.group({
      quantities: this.fb.array([]),
    });

    /* Set quantitiesSubject value */
    this.quantitiesSubject.next(this.cartForm.get('quantities') as FormArray);

    /* Build quantities FormArray */
    this.items$
      .pipe(first())
      .subscribe((items) => this.buildFormArray(this.cartForm, items));

    /* Config NgbModal settings */
    this.ngbModalConfig.centered = true;
    this.ngbModalConfig.backdrop = 'static';
  }

  private onErrorReceived(): void {
    this.pageTitle = 'Retrieval Error';
  }

  private editItem(itemId: number, quantity: number, items: ICartItem[]): void {
    const index = items.findIndex(({ id }) => +id === +itemId);
    const updatedItem = {
      ...items[index],
      quantity,
    } as ICartItem;
    +quantity
      ? this.saveItem(updatedItem, index)
      : this.deleteItem(updatedItem, index);
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
    items.forEach((cartItem) => {
      quantitiesArray.push(
        this.fb.group({
          itemId: +cartItem.id,
          quantity: +cartItem.quantity,
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
              const itemId = +value.itemId;
              const quantity = +value.quantity;
              return this.items$.pipe(
                first(),
                tap((cartItems) => this.editItem(itemId, quantity, cartItems))
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
    this.setFormState(this.cartForm, value);
  }

  private setFormState(form: FormGroup, value: boolean): void {
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
