import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

/* Components */
import { AccountComponent } from './account.component';
import { EditNameComponent } from './edit-name/edit-name.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { OrdersResolverService } from '../router/orders-resolver.service';

/* Routes */
const ROUTES: Routes = [
  {
    path: '',
    component: AccountComponent,
    resolve: { resolvedData: OrdersResolverService },
  },
  {
    path: 'edit',
    redirectTo: 'edit/name',
    pathMatch: 'full',
  },
  {
    path: 'edit/name',
    component: EditNameComponent,
  },
  {
    path: 'edit/contact',
    component: EditContactComponent,
  },
  {
    path: 'edit/address',
    component: EditAddressComponent,
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(ROUTES)],
  declarations: [
    AccountComponent,
    EditNameComponent,
    EditContactComponent,
    EditAddressComponent,
    EditPasswordComponent,
  ],
  providers: [OrdersResolverService],
})
export class AccountModule {}
