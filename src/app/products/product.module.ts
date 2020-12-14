import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { RouterModule, Routes } from '@angular/router';

/* Components */
import { ProductTypesComponent } from './product-types.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

/* Pipes */
import { ConvertToSpacesPipe } from '../pipes/convert-to-spaces.pipe';

/* Resolvers */
import { ProductResolverService } from '../router/product-resolver.service';
import { ProductListResolverService } from '../router/product-list-resolver.service';
import { ProductTypesResolverService } from '../router/product-types-resolver.service';
import { CartItemsResolverService } from '../router/cart-items-resolver.service';

/* Routes */
const ROUTES: Routes = [
  {
    path: '',
    component: ProductTypesComponent,
    resolve: { resolvedData: ProductTypesResolverService },
  },
  {
    path: ':type',
    component: ProductListComponent,
    resolve: {
      resolvedData: ProductListResolverService,
    },
  },
  {
    path: ':type/:id',
    component: ProductDetailsComponent,
    resolve: {
      resolvedData: ProductResolverService,
      // resolvedItems: CartItemsResolverService,
    },
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(ROUTES)],
  declarations: [
    ProductListComponent,
    ProductDetailsComponent,
    ProductTypesComponent,
    ConvertToSpacesPipe,
  ],
})
export class ProductModule {}
