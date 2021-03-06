import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { first, map } from 'rxjs/operators';
import { IProduct } from 'src/app/types/product';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ICartItem } from 'src/app/types/cart-item';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { ProductResult } from 'src/app/types/product-result';
import { NotificationService } from 'src/app/services/notification.service';
import { INotification } from 'src/app/types/notification';
import { BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnInit {
  private itemMaxQty = this.cartService.itemMaxQty;
  private readonly productType = this.route.snapshot.paramMap.get('type');
  private readonly returnLink = this.route.snapshot.queryParamMap.get(
    'returnLink'
  );
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();
  readonly items$ = this.cartService.cartItems$;

  private readonly resolvedData$ = this.route.data.pipe(
    map((d) => {
      const resolvedData = d.resolvedData as ProductResult;
      const title = resolvedData.product
        ? `${resolvedData.product.name}`
        : 'Retrieval Error';
      this.title.setTitle(`Gaming Legend | ${title}`);
      return resolvedData;
    })
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
    private readonly notificationService: NotificationService,
    private readonly title: Title
  ) {}

  ngOnInit(): void {
    this.config.centered = true;
    this.config.backdrop = 'static';
  }

  saveItem(product: IProduct, items: ICartItem[], navigate?: boolean): void {
    const index = this.getIndex(product, items);
    if (items[index].quantity === this.itemMaxQty) {
      if (navigate) {
        this.show(
          `Max quantity already in cart !`,
          'bg-danger text-light',
          50000
        );
        // this.router.navigate(['/user/cart']);
      } else {
        this.openModal(
          `Max Quantity !`,
          `Max quantity of "${product.name}" already in cart!`,
          'bg-danger'
        );
      }
      return;
    }
    const item = this.getUpdatedItem(product, items, index);

    this.setLoading(true);
    this.cartService.saveItem(item, index).subscribe({
      next: (item) => {
        if (navigate) {
          this.show(
            `Added "${product.name}" to cart !`,
            'bg-success text-light',
            10000
          );
        } else {
          this.openModal(
            `Success !`,
            `"${item.name}" added to cart!`,
            'bg-success text-light'
          );
        }
        this.getCartItems(navigate);
      },
      error: () => {
        this.setLoading(false);
        this.show(
          `Error adding "${product.name}" !`,
          'bg-danger text-light',
          15000
        );
      },
    });
  }

  // updateIndex(urls: string[], productUrl: string): void {
  //   const index = urls.findIndex(
  //     (url) => url.toLowerCase() === productUrl.toLowerCase()
  //   );
  //   console.log(index);
  //   if (index < 0 || index) {
  //     return;
  //   }
  //   this.imageIndex = +index;
  // }

  onBack(): void {
    if (this.returnLink) {
      this.router.navigate([`/${this.returnLink}`]);
    } else {
      this.router.navigate(['/products', this.productType], {
        queryParamsHandling: 'preserve',
      });
    }
  }

  private openModal(title: string, message: string, type: string): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    const instance = modalRef.componentInstance;
    instance.title = title;
    instance.message = message;
    instance.type = type;
    instance.closeMessage = 'go to cart';
    instance.dismissMessage = 'keep shopping';
    modalRef.closed.pipe(first()).subscribe({
      error: () => {},
      complete: () => this.router.navigate(['/user', 'cart']),
    });
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

  private getCartItems(navigate?: boolean): void {
    this.cartService.getCartItems().subscribe({
      error: () => {
        this.show(`Error retrieving cart !`, 'bg-danger text-light', 15000);
        this.setLoading(false);
      },
      complete: () => {
        this.setLoading(false);
        if (navigate) {
          this.router.navigate(['/user', 'cart']);
        }
      },
    });
  }
}
