import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NameFormComponent } from './name-form/name-form.component';
import { ContactFormComponent } from './contact-form/contact-form.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    NameFormComponent,
    ContactFormComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  declarations: [NameFormComponent, ContactFormComponent],
})
export class SharedModule {}
