import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  CanDeactivate,
} from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfirmModalComponent } from 'src/app/confirm-modal/confirm-modal.component';
import { CartService } from 'src/app/services/cart.service';
import { CheckOutComponent } from './check-out.component';

@Injectable({
  providedIn: 'root',
})
export class CheckOutGuard
  implements CanActivate, CanDeactivate<CheckOutComponent> {
  constructor(
    private readonly cartService: CartService,
    private readonly modalService: NgbModal,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.cartService.cartItems$.pipe(
      map((items) => {
        if (!items.length) {
          this.router.navigate(['/cart']);
          return false;
        }
        return true;
      })
    );
  }

  canDeactivate(
    component: CheckOutComponent,
    currentRoute: ActivatedRouteSnapshot
  ): Promise<boolean> | boolean {
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

      const confirmModal = modalRef.result.then(
        (result) => {
          return true;
        },
        (reason) => {
          return false;
        }
      );
      return confirmModal;
    }
  }
}
