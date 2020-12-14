import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { NotFoundComponent } from './not-found/not-found.component';
// import { SignInComponent } from './sign-in/sign-in.component';
// import { SignUpComponent } from './sign-in/sign-up/sign-up.component';

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
  //   path: 'sign-in',
  //   component: SignInComponent,
  // },
  // {
  //   path: 'sign-up',
  //   component: SignUpComponent
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
