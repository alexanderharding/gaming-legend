import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { RouterModule, Routes } from '@angular/router';

/* Components */
import { ProductTypesComponent } from './product-types.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

/* Resolvers */
import { ProductResolverService } from '../router/product-resolver.service';
import { ProductListResolverService } from '../router/product-list-resolver.service';
import { ProductTypesResolverService } from '../router/product-types-resolver.service';

/* Services */
import { ProductService } from './product.service';
import { ProductTypeService } from '../services/product-type.service';
import { ProductBrandService } from './product-brand.service';

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
    },
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(ROUTES)],
  declarations: [
    ProductListComponent,
    ProductDetailsComponent,
    ProductTypesComponent,
  ],
  providers: [
    ProductService,
    ProductTypeService,
    ProductTypesResolverService,
    ProductResolverService,
    ProductListResolverService,
    ProductBrandService,
  ],
})
export class ProductModule {}
