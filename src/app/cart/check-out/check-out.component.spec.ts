import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

import { CheckOutComponent } from './check-out.component';

describe('CheckOutComponent', () => {
  let component: CheckOutComponent;
  let fixture: ComponentFixture<CheckOutComponent>;
  let mockRouter;
  let mockRoute;
  let mockCartService;
  const activatedRouteMock = {
    snapshot: {
      data: {
        resolvedData: {
          shippingRates: [
            {
              id: 1,
              rate: 7,
              price: 6.99,
            },
            {
              id: 2,
              rate: 3,
              price: 14.99,
            },
            {
              id: 3,
              rate: 1,
              price: 19.99,
            },
          ],
        },
      },
    },
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckOutComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  it('firstName field validity', () => {
    let firstName = component.checkOutForm.controls['contactGroup.firstName'];
    expect(firstName.valid).toBeFalsy();
  });
});
