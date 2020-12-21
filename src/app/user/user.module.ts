import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { RouterModule, Routes } from '@angular/router';

/* Components */
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInGuard } from './sign-in/sign-in.guard';

/* Routes */
const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [SignInGuard],
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [SignInGuard],
  },
];

@NgModule({
  declarations: [SignInComponent, SignUpComponent],
  imports: [SharedModule, RouterModule.forChild(ROUTES)],
  providers: [SignInGuard],
})
export class UserModule {}
