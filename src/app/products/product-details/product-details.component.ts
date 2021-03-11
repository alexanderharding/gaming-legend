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
    private readonly config: NgbModalConfig,
    private readonly notificationService: NotificationService,
    private readonly title: Title
  ) {}

  ngOnInit(): void {
    this.config.centered = true;
    this.config.backdrop = 'static';
  }

  saveItem(product: IProduct, items: ICartItem[]): void {
    const index = items.findIndex(({ id }) => +id === +product.id);
    if (items[index]?.quantity === this.itemMaxQty) {
      this.show(
        `Max item quantity already in cart !`,
        'bg-danger text-light',
        10000
      );
      this.router.navigate(['/user/cart']);
      return;
    }
    const updatedItem = {
      ...product,
      quantity: index >= 0 ? items[index].quantity + 1 : 1,
    } as ICartItem;
    this.setLoading(true);
    this.cartService.saveItem(updatedItem, index).subscribe({
      next: (item) => {
        this.show(
          `Added "${item.name}" to cart !`,
          'bg-success text-light',
          10000
        );
        this.setLoading(false);
        this.router.navigate(['/user/cart']);
      },
      error: () => {
        this.setLoading(false);
        this.show(
          `Error adding "${product.name}" to cart !`,
          'bg-danger text-light',
          15000
        );
      },
    });
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
}
