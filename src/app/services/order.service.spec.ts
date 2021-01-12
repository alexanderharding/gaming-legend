import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Order } from '../types/order';

import { OrderService } from './order.service';

fdescribe('OrderService', () => {
  let order: Order;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderService],
      imports: [HttpClientTestingModule],
    });
  });

  it('should be created', inject([OrderService], (service: OrderService) => {
    expect(service).toBeTruthy();
  }));

  describe('getOrder', () => {
    it('should call http client with the correct url', inject(
      [OrderService, HttpTestingController],
      (service: OrderService, controller: HttpTestingController) => {
        // Arrange

        // Act
        service.getOrder(1).subscribe();

        // Assert
        controller.expectOne(`http://localhost:3000/orders/${1}`);
        controller.verify();
      }
    ));
  });

  // describe('saveItem', () => {
  //   it(`should call http client with the correct url when order has no id`, inject(
  //     [OrderService, HttpTestingController],
  //     (service: OrderService, controller: HttpTestingController) => {
  //       // Arrange

  //       // Act
  //       service.saveOrder(order, order.id).subscribe();

  //       // Assert
  //       controller.expectOne(`http://localhost:3000/orders`);
  //       controller.verify();
  //     }
  //   ));
  // });
});
