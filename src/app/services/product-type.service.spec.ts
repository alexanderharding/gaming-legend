import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { ProductTypeService } from './product-type.service';

describe('ProductTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductTypeService],
      imports: [HttpClientTestingModule],
    });
  });

  describe('getTypes', () => {
    it('should call http client with the correct url', inject(
      [ProductTypeService, HttpTestingController],
      (service: ProductTypeService, controller: HttpTestingController) => {
        // Arrange

        // Act
        service.getTypes().subscribe();

        // Assert
        const req = controller.expectOne(`http://localhost:3000/types`);
        expect(req.request.method).toEqual('GET');
        controller.verify();
        req.flush({ types: [] });
      }
    ));
  });
});
