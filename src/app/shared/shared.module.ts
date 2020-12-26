import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NameFormComponent } from './name-form/name-form.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { PasswordFormComponent } from './password-form/password-form.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { CurrentPasswordFormComponent } from './current-password-form/current-password-form.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    NameFormComponent,
    ContactFormComponent,
    PasswordFormComponent,
    PaymentFormComponent,
    AddressFormComponent,
    CurrentPasswordFormComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  declarations: [
    NameFormComponent,
    ContactFormComponent,
    PasswordFormComponent,
    PaymentFormComponent,
    AddressFormComponent,
    CurrentPasswordFormComponent,
  ],
})
export class SharedModule {}
