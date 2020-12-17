import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

/* Components */
import { AccountComponent } from './account.component';

/* Routes */
const ROUTES: Routes = [
  {
    path: '',
    component: AccountComponent,
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(ROUTES)],
  declarations: [AccountComponent],
})
export class AccountModule {}
