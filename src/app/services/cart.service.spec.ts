import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ICartItem } from '../types/cart-item';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;
  let total: number;
  let product1: ICartItem;
  let product2: ICartItem;

  beforeEach(() => {
    product1 = {
      id: 31,
      name: 'Element',
      brandId: 1,
      description:
        'Prepare for battle with this iBUYPOWER Element gaming desktop. Featuring an NVIDIA GeForce GTX 1660 graphics card and a six-core Intel Core i7 processor, this PC smoothly runs resource-intensive titles at high settings. This iBUYPOWER Element gaming desktop starts up and loads games in seconds thanks to its 240GB solid-state drive.',
      price: 949.99,
      imageUrl: 'assets/images/element.jpg',
      imageUrls: [
        'assets/images/element.jpg',
        'assets/images/element(1).jpg',
        'assets/images/element(2).jpg',
      ],
      code: 'DDN-1',
      starRating: 2,
      quantity: 3,
      type: 'desktops',
      brand: 'iBUYPOWER',
    };
    product2 = {
      id: 4,
      name: 'Yoga C740',
      brandId: 1,
      description:
        'Lenovo Yoga C740 Convertible 2-in-1 Laptop: Combine power and flexibility with this 15.6-inch Lenovo Yoga convertible notebook. An Intel Core i7 processor and 12GB of RAM let you run multiple programs at once, and the 512GB of storage fits large programs and files. This Lenovo Yoga convertible notebook has a 15.6-inch Full HD touchscreen that delivers stunning images and lets you navigate using touch controls.',
      price: 1099.99,
      imageUrl: 'assets/images/yogaC740.jpg',
      code: 'LDN-4',
      starRating: 4,
      quantity: 5,
      type: 'laptops',
      brand: 'Lenovo',
    };
    TestBed.configureTestingModule({
      providers: [CartService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CartService);
  });

  it('should have no items to start', () => {
    service = new CartService();
    service.items = [];

    expect(service.items.length).toBe(0);
  });

  it('should add an item when updateCart is called', () => {
    service = new CartService();
    service.items = [];

    service.updateCart(product1);

    expect(service.items.length).toBe(1);
  });

  it('should remove all items when clear is called', () => {
    service = new CartService();
    service.items = [];
    service.updateCart(product1);
    service.updateCart(product2);

    service.clearCart();

    expect(service.items.length).toBe(0);
  });

  it('should get total qty of all items when getQtyTotal is called', () => {
    service = new CartService();
    service.items = [];
    service.updateCart(product1);
    service.updateCart(product2);

    total = service.getTotalQty();

    expect(total).toBe(8);
  });

  it('should update item qty when updateCart is called', () => {
    service = new CartService();
    service.items = [];
    service.updateCart(product1);
    service.updateCart(product2);

    const newProduct = {
      ...product2,
      quantity: 7,
    };
    service.updateCart(newProduct);
    total = service.getTotalQty();

    expect(total).toBe(10);
    expect(service.items.length).toBe(2);
  });
});
