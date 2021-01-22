import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IUser } from 'src/app/types/user';

import { EditNameComponent } from './edit-name.component';

describe('EditNameComponent', () => {
  let component: EditNameComponent;
  let fixture: ComponentFixture<EditNameComponent>;
  let mockAuthService;

  const USER: IUser = {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    contact: {
      phone: '8011231234',
      email: 'test@test.com',
    },
    address: {
      street: '123 S Bend Ct',
      city: 'Las Vegas',
      state: 'Nevada',
      zip: '12345',
      country: 'USA',
    },
    password: 'TestPassword1234',
    isAdmin: true,
    id: 121014,
  };

  @Component({
    selector: 'ctacu-current-password-form',
    template: '<div></div>',
  })
  class FakeCurrentPasswordFormComponent {
    @Input() parentForm: FormGroup;
    @Input() submitted: FormGroup;
  }

  @Component({
    selector: 'ctacu-name-form',
    template: '<div></div>',
  })
  class FakeNameFormComponent {
    @Input() parentForm: FormGroup;
    @Input() submitted: FormGroup;
    @Input() pageTitle: string;
    @Input() user: IUser;
  }

  beforeEach(
    waitForAsync(() => {
      mockAuthService = jasmine.createSpyObj(['']);
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          ReactiveFormsModule,
          FormsModule,
          NgbModule,
        ],
        declarations: [
          EditNameComponent,
          FakeNameFormComponent,
          FakeCurrentPasswordFormComponent,
        ],
        // schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNameComponent);
    component = fixture.componentInstance;
    component.user = USER;
    component.loading = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
