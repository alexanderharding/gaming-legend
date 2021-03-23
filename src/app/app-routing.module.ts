import { NgModule } from '@angular/core';

import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { WelcomeComponent } from './core/welcome/welcome.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
// import { AuthGuard } from './account/auth.guard';

const ROUTES: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  {
    path: 'products',
    loadChildren: () =>
      import('./products/product.module').then((m) => m.ProductModule),
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then((m) => m.CartModule),
  },
  // {
  //   path: 'account',
  //   loadChildren: () =>
  //     import('./account/account.module').then((m) => m.AccountModule),
  //   canLoad: [AuthGuard],
  //   canActivate: [AuthGuard],
  // },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
