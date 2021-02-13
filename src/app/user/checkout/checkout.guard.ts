import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  CanDeactivate,
} from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutComponent } from './checkout.component';

@Injectable({
  providedIn: 'root',
})
export class CheckoutGuard
  implements CanActivate, CanDeactivate<CheckoutComponent> {
  constructor(
    private readonly cartService: CartService,
    private readonly modalService: NgbModal,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.cartService.cartItems$.pipe(
      map((items) => {
        if (!items.length) {
          this.router.navigate(['/user', 'cart']);
          return false;
        }
        return true;
      })
    );
  }

  canDeactivate(
    component: CheckoutComponent,
    currentRoute: ActivatedRouteSnapshot
  ): Observable<boolean> | boolean {
    const orderPlaced = component.orderPlaced;
    const retrievalError = currentRoute.data.resolvedData.error;

    if (orderPlaced || retrievalError) {
      return true;
    } else {
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        backdrop: 'static',
        centered: true,
      });
      const instance = modalRef.componentInstance;

      instance.title = 'Cancel';
      instance.message = 'Are you sure you want to cancel the checkout?';
      instance.warningMessage = 'You may lose some progress!';
      instance.type = 'bg-danger';
      instance.closeMessage = 'ok, cancel';
      instance.dismissMessage = 'Checkout';

      return modalRef.closed.pipe(
        map(() => true),
        catchError(() => of(false))
      );
    }
  }
}
