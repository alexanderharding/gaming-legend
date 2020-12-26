import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

/* Components */
import { AccountComponent } from './account.component';
import { EditNameComponent } from './edit-name/edit-name.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';

/* Routes */
const ROUTES: Routes = [
  {
    path: '',
    component: AccountComponent,
  },
  {
    path: 'edit/name',
    component: EditNameComponent,
  },
  {
    path: 'edit/contact',
    component: EditContactComponent,
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(ROUTES)],
  declarations: [AccountComponent, EditNameComponent, EditContactComponent],
})
export class AccountModule {}
