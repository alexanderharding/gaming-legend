import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { RouterModule, Routes } from '@angular/router';

/* Components */
import { SignInComponent } from './sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

/* Routes */
const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
];

@NgModule({
  declarations: [SignInComponent, SignUpComponent],
  imports: [SharedModule, RouterModule.forChild(ROUTES)],
})
export class UserModule {}
