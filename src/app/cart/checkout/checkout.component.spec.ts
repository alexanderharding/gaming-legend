import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IShipping } from 'src/app/types/shipping';
import { ShippingRatesResult } from 'src/app/types/shipping-rates-result';

import { CheckoutComponent } from './checkout.component';

@Pipe({
  name: 'capitalize',
})
class MockCapitalizePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('CheckoutComponent', () => {
  @Component({
    selector: 'cart-cart-summary',
    template: '<div></div>',
  })
  class FakeCartSummaryComponent {
    @Input() shippingRates: IShipping[];
  }

  @Component({
    selector: 'ctacu-error-received',
    template: '<div></div>',
  })
  class FakeErrorReceivedComponent {
    @Input() errorMessage: string;
  }

  describe('onShippingRatesReceived', () => {
    let component: CheckoutComponent;
    let fixture: ComponentFixture<CheckoutComponent>;
    let mockActivatedRoute;

    const SHIPPINGRATES: IShipping[] = [
      {
        id: 1,
        days: 7,
        price: 6.99,
        title: 'Standard',
      },
      {
        id: 2,
        days: 3,
        price: 14.99,
        title: 'Fast',
      },
      {
        id: 3,
        days: 1,
        price: 19.99,
        title: 'Insanely Fast',
      },
    ];
    const RESOLVEDDATA: ShippingRatesResult = {
      shippingRates: SHIPPINGRATES,
    };

    beforeEach(
      waitForAsync(() => {
        mockActivatedRoute = jasmine.createSpyObj([], {
          snapshot: {
            data: {
              resolvedData: RESOLVEDDATA,
            },
          },
        });
        TestBed.configureTestingModule({
          imports: [
            HttpClientTestingModule,
            RouterTestingModule,
            ReactiveFormsModule,
          ],
          declarations: [
            CheckoutComponent,
            MockCapitalizePipe,
            FakeCartSummaryComponent,
          ],
          providers: [
            { provide: ActivatedRoute, useValue: mockActivatedRoute },
          ],
        }).compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckoutComponent);
      component = fixture.componentInstance;
    });

    it('should create', () => {
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });
  });
});
