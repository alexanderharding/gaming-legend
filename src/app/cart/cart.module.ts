import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { RouterModule, Routes } from '@angular/router';

/* Components */
import { CartComponent } from '../cart/cart.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { SuccessComponent } from './success/success.component';
import { CartSummaryComponent } from './cart-summary/cart-summary.component';

/* Gaurds */
import { CheckOutGuard } from './check-out/check-out.guard';

/* Resolvers */
import { ShippingRatesResolverService } from '../router/shipping-rates-resolver.service';

/* Routes */
const ROUTES: Routes = [
  {
    path: '',
    component: CartComponent,
    resolve: {
      resolvedData: ShippingRatesResolverService,
    },
  },
  {
    path: 'check-out',
    component: CheckOutComponent,
    canActivate: [CheckOutGuard],
    canDeactivate: [CheckOutGuard],
    resolve: {
      resolvedData: ShippingRatesResolverService,
      // resolvedUser: UserResolverService,
    },
  },
  {
    path: 'success',
    // canActivate: [CheckOutGuard],
    component: SuccessComponent,
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(ROUTES)],
  declarations: [
    CheckOutComponent,
    SuccessComponent,
    CartComponent,
    CartSummaryComponent,
  ],
  providers: [CheckOutGuard, ShippingRatesResolverService],
})
export class CartModule {}
