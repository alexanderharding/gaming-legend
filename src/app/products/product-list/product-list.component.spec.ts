import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IProduct } from 'src/app/types/product';
import { ProductListComponent } from './product-list.component';

xdescribe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService;
  let PRODUCTS: IProduct[];

  // beforeEach(() => {
  //   PRODUCTS = [
  //     {
  //       "name": "IdeaPad 3",
  //       "code": "gdx-11",
  //       "brandId": 1,
  //       "brand": "Lenovo",
  //       "description": "With the Lenovo IdeaPad 3 14-inch laptop, you'll enjoy powerful performance for all types of everyday tasks. Whether you're working from your home office, a student who needs a lightweight laptop for school, or just need a great entry-level Windows computer for entertainment, video chats, and other day-to-day uses, this practical notebook is engineered for long-lasting performance. Powered by the new Ryzen™ 5 3500U Mobile Processors with Radeon™ Graphics, you'll get multi-core processing power to help you get more things done faster.",
  //       "price": 449.99,
  //       "quantity": 1,
  //       "starRating": 4,
  //       "imageUrl": "assets/images/ideapad3.jpg"
  //     },
  //     {
  //       "name": "Ideapad L340",
  //       "code": "gdx-12",
  //       "brand": "Lenovo",
  //       "brandId": 1,
  //       "description": "With the Lenovo Idea Pad L340 gaming Laptop, you know you've made the right decision with one serious laptop. Equipped with the latest Intel Core i5 processor, next-gen NVIDIA GeForce graphics, and jaw-dropping Dolby Audio, you'll experience first-hand real power and seamless play. You'll stay focused on the task at hand, concentrating on beating Your opponents and confident that your sleek, stylish computer will keep up with the competition.",
  //       "price": 855.67,
  //       "starRating": 2,
  //       "imageUrl": "assets/images/ideapadL340.jpg"
  //     },
  //     {
  //       "name": "Notebook 9 Pro",
  //       "code": "gdx-13",
  //       "brand": "Samsung",
  //       "brandId": 2,
  //       "description": "Bring flexibility to work with the powerful and versatile Samsung Notebook 9 Pro. Easily switch between typing on the keyboard, writing with the intuitive S Pen, and navigating the brilliant touchscreen. And do it all at once with an ultra-fast 8th Generation Intel Core i7 processor and a Radeon 540 graphics card. The Samsung Notebook 9 Pro keeps up with all the ways you work.",
  //       "price": 1649,
  //       "starRating": 5,
  //       "imageUrl": "assets/images/notebook9pro.jpg"
  //     }
  //   ]

  //   mockProductService = jasmine.createSpyObj(['clearFilters', 'scrollToTop', ])

  //   component = new ProductListComponent(mockProductService, route)
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
