import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NameFormComponent } from './name-form/name-form.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { PasswordFormComponent } from './password-form/password-form.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    NameFormComponent,
    ContactFormComponent,
    PasswordFormComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  declarations: [
    NameFormComponent,
    ContactFormComponent,
    PasswordFormComponent,
  ],
})
export class SharedModule {}
