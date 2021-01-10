import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { map, tap } from 'rxjs/operators';
import { IProduct } from 'src/app/types/product';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ICartItem } from 'src/app/types/cart-item';
import { ConfirmModalComponent } from 'src/app/confirm-modal/confirm-modal.component';
import { ProductResult } from 'src/app/types/product-result';
import { NotificationService } from 'src/app/services/notification.service';
import { INotification } from 'src/app/types/notification';
import { BehaviorSubject } from 'rxjs';

@Component({
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild('successTpl') private successTpl: TemplateRef<any>;
  @ViewChild('dangerTpl') private dangerTpl: TemplateRef<any>;
  private readonly productType = this.route.snapshot.paramMap.get('type');
  private readonly returnLink = this.route.snapshot.queryParamMap.get(
    'returnLink'
  );

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  imageIndex = 0;

  readonly items$ = this.cartService.cartItems$.pipe(
    tap(() => this.setLoading(false))
  );

  private readonly resolvedData$ = this.route.data.pipe(
    map((d) => d.resolvedData as ProductResult)
  );

  readonly product$ = this.resolvedData$.pipe(
    map((r) => r.product as IProduct)
  );

  readonly error$ = this.resolvedData$.pipe(map((r) => r.error as string));

  constructor(
    private readonly cartService: CartService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly modalService: NgbModal,
    private readonly config: NgbModalConfig,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.config.centered = true;
    this.config.backdrop = 'static';
  }

  buyNow(product: IProduct, items: ICartItem[]): void {
    this.setLoading(true);
    const index = this.getIndex(product, items);
    const item = this.getUpdatedItem(product, items, index);
    this.cartService.saveItem(item, index).subscribe(
      (result) => {
        this.refreshCart();
        this.showSuccess();
        this.setLoading(false);
        this.router.navigate(['/cart']);
      },
      (error) => {
        this.setLoading(false);
        this.showDanger();
        console.error(error);
      }
    );
  }

  addItem(product: IProduct, items: ICartItem[]): void {
    this.setLoading(true);
    const index = this.getIndex(product, items);
    const item = this.getUpdatedItem(product, items, index);
    this.cartService.saveItem(item, index).subscribe(
      (result) => {
        this.refreshCart();
        this.showSuccess();
        const modalRef = this.modalService.open(ConfirmModalComponent);
        const instance = modalRef.componentInstance;
        instance.title = `${result.name} Added`;
        instance.message = `"${result.name}" added to the cart!`;
        instance.type = 'bg-success';
        instance.closeMessage = 'go to cart';
        instance.dismissMessage = 'keep shopping';
        modalRef.result.then(
          (result) => this.router.navigate(['/cart']),
          (reason) => {}
        );
      },
      (error) => {
        this.setLoading(false);
        this.showDanger();
        console.error(error);
      }
    );
  }

  updateIndex(urls: string[], productUrl: string): void {
    const index = urls.findIndex(
      (url) => url.toLowerCase() === productUrl.toLowerCase()
    );
    if (index < 0 || index === (null || undefined)) {
      return;
    }
    this.imageIndex = +index;
  }

  onBack(): void {
    if (this.returnLink) {
      this.router.navigate([`/${this.returnLink}`]);
    } else {
      this.router.navigate(['/products', this.productType], {
        queryParamsHandling: 'preserve',
      });
    }
  }

  private getIndex(product: IProduct, items: IProduct[]): number {
    return +items.findIndex(({ id }) => id === +product.id);
  }

  private getUpdatedItem(
    product: IProduct,
    items: ICartItem[],
    index: number
  ): ICartItem {
    return {
      ...product,
      quantity: index >= 0 ? items[index].quantity + 1 : 1,
    } as ICartItem;
  }

  private setLoading(value: boolean): void {
    this.loadingSubject.next(value);
  }

  private showSuccess(): void {
    const notification = {
      textOrTpl: this.successTpl,

      className: 'bg-success text-light',
      delay: 10000,
    } as INotification;
    this.notificationService.show(notification);
  }

  private showDanger(): void {
    const notification = {
      textOrTpl: this.dangerTpl,
      className: 'bg-danger text-light',
      delay: 15000,
    } as INotification;
    this.notificationService.show(notification);
  }

  private refreshCart(): void {
    this.cartService.getCartItems().subscribe({
      error: (error) => {
        this.setLoading(false);
        console.error(error);
      },
    });
  }
}
