import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

/* Components */
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CartComponent } from './cart/cart.component';
import { CartSummaryComponent } from './cart-summary/cart-summary.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderPlacedComponent } from './order-placed/order-placed.component';

/* Guards */
import { CheckoutGuard } from './checkout/checkout.guard';
// import { SignInGuard } from './sign-in/sign-in.guard';

/* Services */
import { ShippingRatesResolverService } from '../router/shipping-rates-resolver.service';

/* Routes */
const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'cart',
    pathMatch: 'full',
  },
  // {
  //   path: 'sign-in',
  //   component: SignInComponent,
  //   canActivate: [SignInGuard],
  // },
  // {
  //   path: 'sign-up',
  //   component: SignUpComponent,
  //   canActivate: [SignInGuard],
  // },
  {
    path: 'cart',
    component: CartComponent,
    resolve: {
      resolvedData: ShippingRatesResolverService,
    },
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [CheckoutGuard],
    canDeactivate: [CheckoutGuard],
    resolve: {
      resolvedData: ShippingRatesResolverService,
    },
  },
  {
    path: 'order-placed',
    component: OrderPlacedComponent,
  },
];

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    CartComponent,
    CartSummaryComponent,
    CheckoutComponent,
    OrderPlacedComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(ROUTES)],
  providers: [CheckoutGuard, ShippingRatesResolverService],
})
export class UserModule {}
