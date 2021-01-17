import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { IProduct } from 'src/app/types/product';
import { ProductResult } from 'src/app/types/product-result';

import { ProductDetailsComponent } from './product-details.component';

xdescribe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let product: IProduct;
  let mockRouter;
  const resolvedData: ProductResult = {
    product: {
      id: 1,
      name: 'Ideapad L340',
      brandId: 1,
      code: 'GDN-01',
      starRating: 3,
      description:
        "With the Lenovo Idea Pad L340 gaming Laptop, you know you've made the right decision with one serious laptop. Equipped with the latest Intel Core i5 processor, next-gen NVIDIA GeForce graphics, and jaw-dropping Dolby Audio, you'll experience first-hand real power and seamless play. You'll stay focused on the task at hand, concentrating on beating Your opponents and confident that your sleek, stylish computer will keep up with the competition.",
      price: 855.67,
      imageUrl: 'assets/images/ideapadL340.jpg',
      type: 'laptops',
    },
  };
  const data = of(resolvedData);

  // const activatedRouteMock;

  beforeEach(async(() => {
    product = {
      id: 1,
      name: 'Ideapad L340',
      brandId: 1,
      code: 'GDN-01',
      starRating: 3,
      description:
        "With the Lenovo Idea Pad L340 gaming Laptop, you know you've made the right decision with one serious laptop. Equipped with the latest Intel Core i5 processor, next-gen NVIDIA GeForce graphics, and jaw-dropping Dolby Audio, you'll experience first-hand real power and seamless play. You'll stay focused on the task at hand, concentrating on beating Your opponents and confident that your sleek, stylish computer will keep up with the competition.",
      price: 855.67,
      imageUrl: 'assets/images/ideapadL340.jpg',
      type: 'laptops',
    };
    TestBed.configureTestingModule({
      declarations: [ProductDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },

        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: data,
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
