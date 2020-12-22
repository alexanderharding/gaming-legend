import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NameFormComponent } from './name-form/name-form.component';

@NgModule({
  imports: [CommonModule],
  exports: [
    NameFormComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
})
export class SharedModule {}
