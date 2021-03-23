import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

/* Router */
import { ActivatedRoute } from '@angular/router';

/* Rxjs */
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

/* Components */
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';

/* Services */
import { CartService } from '../core/cart.service';
import { NotificationService } from '../core/notification.service';

/* Title */
import { Title } from '@angular/platform-browser';

/* NgbModal */
import {
  NgbModal,
  NgbModalConfig,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

/* Forms */
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';

/* Interfaces */
import { ICartItem } from '../types/cart-item';
import { INotification } from '../types/notification';
import { IShipping } from '../types/shipping';
import { IQuantityControlValue } from 'src/app/types/quantity-control-value';

/* Classes */
import { ShippingRatesResult } from '../types/shipping-rates-result';

@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit, OnDestroy {
  pageTitle = 'Review Cart';
  cartForm: FormGroup;
  loading$: Observable<boolean>;
  shippingRates: IShipping[];
  errorMessage: string;
  items$: Observable<ICartItem[]>;
  quantityOptions: number[];
  quantities$: Observable<FormArray>;

  /* Get snapshot data from ActivatedRoute */
  private readonly resolvedData = this.route.snapshot.data
    .resolvedData as ShippingRatesResult;

  /* BehaviorSubject for displaying loading spinner */
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  /* BehaviorSubject for displaying quantities FormArray */
  private readonly quantitiesSubject = new BehaviorSubject<FormArray>(null);

  /* Subscriptions array for storing and cleaning up subscriptions onDestroy */
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
    this.shippingRates = this.resolvedData.shippingRates;
    this.errorMessage = this.resolvedData.error;
    this.shippingRates
      ? this.onShippingRatesReceived()
      : this.onErrorReceived();
    this.title.setTitle(`Gaming Legend | ${this.pageTitle}`);
  }

  openDeleteModal(item: ICartItem, items: ICartItem[]): void {
    const modalRef: NgbModalRef = this.openModal(
      `Are you sure you want remove "${item.name}" from the cart?`,
      'Remove'
    );
    modalRef.closed.pipe(first()).subscribe({
      error: () => {},
      complete: () => {
        this.setLoading(true);
        this.deleteItem(item, this.findIndexById(item.id, items));
      },
    });
  }

  openDeleteAllModal(items: ICartItem[]): void {
    const modalRef: NgbModalRef = this.openModal(
      `Are you sure you want to empty the cart?`,
      'Empty'
    );
    modalRef.closed.pipe(first()).subscribe({
      error: () => {},
      complete: () => {
        this.setLoading(true);
        this.deleteAllItems(items);
      },
    });
  }

  private onShippingRatesReceived(): void {
    /* Set Observable for displaying loading spinner */
    this.loading$ = this.loadingSubject.asObservable();

    /* Set items$ and quantityOptions from CartService */
    this.items$ = this.cartService.cartItems$;
    this.quantityOptions = this.cartService.quantityOptions;

    /* Set Observable for displaying quantities FormArray */
    this.quantities$ = this.quantitiesSubject.asObservable();

    /* Set cartForm and configure quantities FormArray */
    this.cartForm = this.buildForm();
    const quantitiesArray = this.cartForm.get('quantities') as FormArray;
    this.configFormArray(quantitiesArray);

    /* Set quantitiesSubject value */
    this.quantitiesSubject.next(quantitiesArray);

    /* Config NgbModal settings */
    this.ngbModalConfig.centered = true;
    this.ngbModalConfig.backdrop = 'static';
  }

  private onErrorReceived(): void {
    /* Set pageTitle */
    this.pageTitle = 'Retrieval Error';
  }

  private openModal(message: string, closeMessage: string): NgbModalRef {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmModalComponent);
    const instance = modalRef.componentInstance as ConfirmModalComponent;
    instance.message = message;
    instance.closeMessage = closeMessage;
    return modalRef;
  }

  private editItem(itemId: number, quantity: number): void {
    this.items$.pipe(first()).subscribe((items) => {
      const index: number = this.findIndexById(itemId, items);
      const item: ICartItem = this.createUpdatedItem(items[+index], +quantity);
      +quantity ? this.saveItem(item, +index) : this.deleteItem(item, +index);
    });
  }

  private saveItem(item: ICartItem, index: number): void {
    this.cartService.saveItem(item, +index).subscribe({
      error: () => this.onError(`Error updating ${item.name} !`),
      complete: () => this.setLoading(false),
    });
  }

  private deleteItem(item: ICartItem, index: number): void {
    this.cartService.deleteItem(item).subscribe({
      error: () => this.onError(`Error removing ${item.name} !`),
      complete: () => {
        this.onItemDeleted(+index);
        this.setLoading(false);
      },
    });
  }

  private deleteAllItems(items: ICartItem[]): void {
    this.cartService.deleteAllItems(items).subscribe({
      next: () => this.onItemDeleted(0),
      error: () => this.onError(`Error emptying cart !`),
      complete: () => this.setLoading(false),
    });
  }

  private createUpdatedItem(item: ICartItem, quantity: number): ICartItem {
    return {
      ...item,
      quantity,
    } as ICartItem;
  }

  private configFormArray(formArray: FormArray): void {
    this.items$
      .pipe(first())
      .subscribe((items) => this.setFormArray(formArray, items));
    this.setSubscriptions(formArray.controls);
  }

  private setFormArray(formArray: FormArray, items: ICartItem[]): void {
    items.forEach((item) => formArray.push(this.buildQuantity(item)));
  }

  private setSubscriptions(controls: AbstractControl[]): void {
    controls.forEach((c) =>
      this.subscriptions.push(this.createSubscription(c))
    );
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      quantities: this.fb.array([]),
    });
  }

  private buildQuantity(item: ICartItem): FormGroup {
    const object: IQuantityControlValue = {
      itemId: +item.id,
      quantity: +item.quantity,
    };
    return this.fb.group(object);
  }

  private createSubscription(c: AbstractControl): Subscription {
    return c.valueChanges.subscribe((value: IQuantityControlValue) => {
      this.setLoading(true);
      this.editItem(+value.itemId, +value.quantity);
    });
  }

  private removeSubscriptionAt(index: number): void {
    this.subscriptions[index].unsubscribe();
    this.subscriptions.splice(index, 1);
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

  private findIndexById(itemId: number, items: ICartItem[]): number {
    return items.findIndex(({ id }) => +id === +itemId);
  }

  private onItemDeleted(index: number): void {
    const quantitiesArray = this.cartForm.get('quantities') as FormArray;
    this.removeSubscriptionAt(+index);
    quantitiesArray.removeAt(+index);
  }

  private onError(message: string): void {
    this.show(message, 'bg-danger text-light', 15000);
    this.setLoading(false);
  }

  private show(textOrTpl: string, className: string, delay?: number): void {
    const notification: INotification = {
      textOrTpl,
      className,
      delay,
    };
    this.notificationService.show(notification);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
