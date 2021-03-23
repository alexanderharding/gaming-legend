import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ICartItem } from '../types/cart-item';
import { CartService } from './cart.service';
import { ErrorService } from './error.service';
import { NotificationService } from './notification.service';
import { ShippingRateService } from '../user/shipping-rate.service';

describe('CartService', () => {
  let mockShippingRateService: ShippingRateService;
  let mockErrorService;
  let mockNotificationService;

  const ITEMS: ICartItem[] = [
    {
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
      features: [
        {
          title: 'Windows 10 operating system',
          body:
            'Windows 10 brings back the Start Menu from Windows 7 and introduces new features, like the Edge Web browser that lets you markup Web pages on your screen.',
        },
        {
          title: '9th Gen Intel® Core™ i7-9700F processor',
          body: 'Powerful six-core, twelve-way processing performance.',
        },
        {
          title: '16GB system memory for intense multitasking and gaming',
          body:
            'Reams of high-bandwidth DDR4 RAM to smoothly run your graphics-heavy PC games and video-editing applications, as well as numerous programs and browser tabs all at once.',
        },
        {
          title:
            '2TB hard drive and 240GB solid state drive (SSD) for a blend of storage space and speed',
          body:
            'The hard drive provides ample storage, while the SSD delivers faster start-up times and data access.',
        },
        {
          title: 'NVIDIA GeForce GTX 1660 graphics',
          body:
            'Driven by 3GB GDDR5 dedicated video memory to quickly render high-quality images for videos and games.',
        },
        {
          title: '4 USB 3.0 ports maximize the latest high-speed devices',
          body:
            'Also includes 2 USB 2.0 ports to connect more accessories and peripherals. The USB 3.0 ports are backward-compatible with USB 2.0 devices (at 2.0 speeds).',
        },
        {
          title: 'Next-generation wireless connectivity',
          body:
            'Connects to your network or hotspots on all current Wi-Fi standards. Connect to a Wireless-AC router for speed nearly 3x faster than Wireless-N. Gigabit LAN port also plugs into wired networks.',
        },
      ],
      type: 'desktops',
      code: 'DDN-31',
      starRating: 2,
      brand: 'iBUYPOWER',
      quantity: 1,
    },
    {
      id: 32,
      name: 'Snowblind',
      brandId: 1,
      description:
        'iBUYPOWER Snowblind Desktop: Step up your gaming performance with this iBUYPOWER Snowblind desktop computer. An Intel Core i9 processor and 16GB of RAM let you play high-end titles, while the NVIDIA RTX 2080 SUPER graphics card delivers crisp, high-resolution graphics. This iBUYPOWER Snowblind desktop computer has a 1TB HDD and a 480GB SSD for ample file storage and fast data access.',
      price: 1999.99,
      imageUrl: 'assets/images/snowblind.jpg',
      imageUrls: [
        'assets/images/snowblind.jpg',
        'assets/images/snowblind(1).jpg',
        'assets/images/snowblind(2).jpg',
      ],
      features: [
        {
          title: 'Windows 10 operating system',
          body:
            'Windows 10 brings back the Start Menu from Windows 7 and introduces new features, like the Edge Web browser that lets you markup Web pages on your screen.',
        },
        {
          title: '9th Gen Intel® Core™ i9-9900KF processor',
          body: 'Powerful eight-core, sixteen-way processing performance.',
        },
        {
          title: '16GB system memory for intense multitasking and gaming',
          body:
            'Reams of high-bandwidth DDR4 RAM to smoothly run your graphics-heavy PC games and video-editing applications, as well as numerous programs and browser tabs all at once.',
        },
        {
          title:
            '1TB hard drive and 480GB solid state drive (SSD) for a blend of storage space and speed',
          body:
            'The hard drive provides ample storage, while the SSD delivers faster start-up times and data access.',
        },
        {
          title: 'NVIDIA GeForce RTX 2080 SUPER graphics',
          body:
            'Driven by 8GB dedicated video memory to quickly render high-quality images for videos and games.',
        },
        {
          title: '4 USB 3.0 ports maximize the latest high-speed devices',
          body:
            'Also includes 4 USB 2.0 ports to connect more accessories and peripherals. The USB 3.0 ports are backward-compatible with USB 2.0 devices (at 2.0 speeds).',
        },
        {
          title: 'Next-generation wireless connectivity',
          body:
            'Connects to your network or hotspots on all current Wi-Fi standards. Connect to a Wireless-AC router for speed nearly 3x faster than Wireless-N. Gigabit LAN port also plugs into wired networks.',
        },
      ],
      type: 'desktops',
      code: 'DDN-32',
      starRating: 5,
      brand: 'iBUYPOWER',
      quantity: 1,
    },
    {
      id: 1,
      name: 'Ideapad L340',
      brandId: 1,
      description: `With the Lenovo Idea Pad L340 gaming Laptop, you know you've made the right decision with one serious laptop. Equipped with the latest Intel Core i5 processor, next-gen NVIDIA GeForce graphics, and jaw-dropping Dolby Audio, you'll experience first-hand real power and seamless play. You'll stay focused on the task at hand, concentrating on beating Your opponents and confident that your sleek, stylish computer will keep up with the competition.`,
      price: 855.67,
      imageUrl: 'assets/images/ideapadL340.jpg',
      code: 'LDN-1',
      starRating: 2,
      type: 'laptops',
      brand: 'Lenovo',
      quantity: 1,
    },
  ];
  const TAX = 0.0687;
  const QUANTITY = ITEMS.reduce((prev, current) => {
    return +prev + +current.quantity;
  }, 0);
  const SUBTOTAL = ITEMS.reduce((prev, current) => {
    return +(prev + +current.price * +current.quantity).toFixed(2);
  }, 0);
  const TOTALTAX = +(SUBTOTAL * TAX).toFixed(2);
  const TOTAL = +(SUBTOTAL + TOTALTAX + 6.99).toFixed(2);
  const SHIPPINGPRICESELECTED = 6.99;

  beforeEach(() => {
    mockShippingRateService = jasmine.createSpyObj([''], {
      shippingPriceSelectedAction$: of(SHIPPINGPRICESELECTED),
    });
    mockErrorService = jasmine.createSpyObj(['handleError']);
    mockNotificationService = jasmine.createSpyObj(['show']);
    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: ShippingRateService, useValue: mockShippingRateService },
        { provide: NotificationService, useValue: mockNotificationService },

        { provide: ErrorService, useValue: mockErrorService },
      ],
      imports: [HttpClientTestingModule],
    });
  });

  it('should be created', inject([CartService], (service: CartService) => {
    expect(service).toBeTruthy();
  }));

  it('should have set cartItems$ correctly', fakeAsync(() => {
    inject(
      [CartService, HttpTestingController],
      (service: CartService, controller: HttpTestingController) => {
        // Arrange
        let items: ICartItem[];
        const req = controller.expectOne('http://localhost:3000/cart');
        req.flush(ITEMS);
        tick(1000);

        // Act
        service.cartItems$.subscribe((i) => (items = i));

        // Assert
        expect(items).toBe(ITEMS);
        controller.verify();
      }
    )();
  }));

  it('should have set itemMaxQty correctly', inject(
    [CartService],
    (service: CartService) => {
      // Arrange

      // Act

      // Asserts
      expect(service.itemMaxQty).toBe(5);
    }
  ));

  it('should have set cartQuantity$ correctly', fakeAsync(() => {
    inject(
      [CartService, HttpTestingController],
      (service: CartService, controller: HttpTestingController) => {
        // Arrange
        let quantity: number;
        const req = controller.expectOne('http://localhost:3000/cart');
        req.flush(ITEMS);
        tick(1000);

        // Act
        service.cartQuantity$.subscribe((q) => (quantity = q));

        // Assert
        expect(quantity).toBe(QUANTITY);
        controller.verify();
      }
    )();
  }));

  it('should have set subtotal$ correctly', fakeAsync(() => {
    inject(
      [CartService, HttpTestingController],
      (service: CartService, controller: HttpTestingController) => {
        // Arrange
        let subtotal: number;
        const req = controller.expectOne('http://localhost:3000/cart');
        expect(req.request.method).toEqual('GET');
        req.flush(ITEMS);
        tick(1000);

        // Act
        service.subtotal$.subscribe((s) => (subtotal = s));

        // Assert
        expect(subtotal).toBe(SUBTOTAL);
        controller.verify();
      }
    )();
  }));

  it('should have set totalTax$ correctly', fakeAsync(() => {
    inject(
      [CartService, HttpTestingController],
      (service: CartService, controller: HttpTestingController) => {
        // Arrange
        let totalTax: number;
        const req = controller.expectOne('http://localhost:3000/cart');
        req.flush(ITEMS);
        tick(1000);

        // Act
        service.totalTax$.subscribe((t) => (totalTax = t));

        // Assert
        expect(totalTax).toBe(TOTALTAX);
        controller.verify();
      }
    )();
  }));

  it('should have set total$ correctly', fakeAsync(() => {
    inject(
      [CartService, HttpTestingController],
      (service: CartService, controller: HttpTestingController) => {
        // Arrange
        let total: number;
        const req = controller.expectOne('http://localhost:3000/cart');
        req.flush(ITEMS);
        tick(1000);

        // Act
        service.total$.subscribe((t) => (total = t));

        // Assert
        expect(total).toBe(TOTAL);
        controller.verify();
      }
    )();
  }));

  it('should have set quantityOptions correctly', fakeAsync(() => {
    inject([CartService], (service: CartService) => {
      // Arrange
      const options: number[] = [];
      for (let i = 0; i <= service.itemMaxQty; i++) {
        options.push(i);
      }

      // Act

      // Asserts
      expect(service.quantityOptions).toEqual(options);
    })();
  }));

  it('should have called http client with the correct url', inject(
    [CartService, HttpTestingController],
    (_service: CartService, controller: HttpTestingController) => {
      // Arrange

      // Act

      // Assert
      const req = controller.expectOne('http://localhost:3000/cart');
      expect(req.request.method).toEqual('GET');
      controller.verify();
    }
  ));

  it(`should have not called show method on
    NotificationService`, fakeAsync(() => {
    inject(
      [CartService, HttpTestingController],
      (_service: CartService, controller: HttpTestingController) => {
        // Arrange

        // Act
        const req = controller.expectOne('http://localhost:3000/cart');
        req.flush(ITEMS);
        tick(1000);

        // Assert
        expect(mockNotificationService.show).toHaveBeenCalledTimes(0);
        controller.verify();
      }
    )();
  }));

  xit(`should have not called show method on
    NotificationService`, fakeAsync(() => {
    inject(
      [CartService, HttpTestingController],
      (_service: CartService, controller: HttpTestingController) => {
        // Arrange
        mockErrorService.handleError.and.returnValue(of(true));

        // Act
        const req = controller.expectOne('http://localhost:3000/cart');
        req.error(null);
        tick(4000);

        // Assert
        expect(mockNotificationService.show).toHaveBeenCalledTimes(1);
        controller.verify();
      }
    )();
  }));

  xit(`should have called show method on NotificationService with correct value
    when http client returns an error`, inject(
    [CartService, HttpTestingController],
    (_service: CartService, controller: HttpTestingController) => {
      // Arrange
      // Act
      const req = controller.expectOne('http://localhost:3000/cart');
      req.error(null);

      // Assert
      expect(mockNotificationService.show).toHaveBeenCalledTimes(1);
      controller.verify();
    }
  ));

  describe('saveItem', () => {
    it(`should call http client with the correct url when index is less than
      0`, inject(
      [CartService, HttpTestingController],
      (service: CartService, controller: HttpTestingController) => {
        // Arrange
        const index = -1;
        let req: TestRequest;
        req = controller.expectOne('http://localhost:3000/cart');

        // Act
        service.saveItem(ITEMS[1], index).subscribe();

        // Assert

        req = controller.expectOne('http://localhost:3000/cart');
        expect(req.request.method).toEqual('POST');
        controller.verify();
      }
    ));

    it(`should call http client with the correct url when index is greater than
      or equal to 0`, inject(
      [CartService, HttpTestingController],
      (service: CartService, controller: HttpTestingController) => {
        // Arrange
        const index = 0;
        let req: TestRequest;
        req = controller.expectOne('http://localhost:3000/cart');

        // Act
        service.saveItem(ITEMS[index], index).subscribe();

        // Assert
        req = controller.expectOne(
          `http://localhost:3000/cart/${ITEMS[index].id}`
        );
        expect(req.request.method).toEqual('PUT');
        controller.verify();
      }
    ));

    it(`should not call handleError method on ErrorService`, fakeAsync(() => {
      inject(
        [CartService, HttpTestingController],
        (service: CartService, controller: HttpTestingController) => {
          // Arrange
          let index: number;
          const itemIndex = 1;
          let req: TestRequest;
          req = controller.expectOne('http://localhost:3000/cart');
          req.flush(ITEMS);

          // Act
          index = -1;
          service.saveItem(ITEMS[itemIndex], index).subscribe();
          req = controller.expectOne(`http://localhost:3000/cart`);
          req.flush(ITEMS[itemIndex]);
          tick(1000);

          index = 0;
          service.saveItem(ITEMS[itemIndex], index).subscribe();
          req = controller.expectOne(
            `http://localhost:3000/cart/${ITEMS[itemIndex].id}`
          );
          req.flush(ITEMS[itemIndex]);
          tick(1000);

          // Assert
          expect(mockErrorService.handleError).toHaveBeenCalledTimes(0);
          controller.verify();
        }
      )();
    }));

    xit(`should call handleError method on ErrorService when http client returns
      an error`, fakeAsync(() => {
      inject(
        [CartService, HttpTestingController],
        (service: CartService, controller: HttpTestingController) => {
          // Arrange
          mockErrorService.handleError.and.returnValue(of(true));
          let index: number;
          const itemIndex = 1;
          let req: TestRequest;
          req = controller.expectOne('http://localhost:3000/cart');
          req.flush(ITEMS);

          // Act
          index = -1;
          service.saveItem(ITEMS[itemIndex], index).subscribe();
          req = controller.expectOne(`http://localhost:3000/cart`);
          req.error(null);
          tick(1000);

          // index = 0;
          // service.saveItem(ITEMS[itemIndex], index).subscribe();
          // req = controller.expectOne(
          //   `http://localhost:3000/cart/${ITEMS[itemIndex].id}`
          // );
          // req.flush(ITEMS[itemIndex]);
          // tick(1000);

          // Assert
          expect(mockErrorService.handleError).toHaveBeenCalledTimes(1);
          controller.verify();
        }
      )();
    }));

    it(`should set cartItems$ correctly when index is less than
      0`, fakeAsync(() => {
      inject(
        [CartService, HttpTestingController],
        (service: CartService, controller: HttpTestingController) => {
          // Arrange
          const index = -1;
          const itemIndex = 1;
          let req: TestRequest;
          let items: ICartItem[];
          req = controller.expectOne('http://localhost:3000/cart');
          req.flush(ITEMS);

          // Act
          service.saveItem(ITEMS[itemIndex], index).subscribe();
          req = controller.expectOne(`http://localhost:3000/cart`);
          req.flush(ITEMS[itemIndex]);
          tick(1000);
          service.cartItems$.subscribe((i) => (items = i));

          // Assert
          const updatedItems = [...ITEMS] as ICartItem[];
          updatedItems.push(ITEMS[itemIndex]);
          expect(items).toEqual(updatedItems);
          controller.verify();
        }
      )();
    }));

    it(`should set cartItems$ correctly when index is greater than or equal to
      0`, fakeAsync(() => {
      inject(
        [CartService, HttpTestingController],
        (service: CartService, controller: HttpTestingController) => {
          // Arrange
          const index = 0;
          const itemIndex = 1;
          let req: TestRequest;
          let items: ICartItem[];
          let updatedItem: ICartItem;
          req = controller.expectOne('http://localhost:3000/cart');
          req.flush(ITEMS);

          // Act
          updatedItem = {
            ...ITEMS[itemIndex],
            quantity: ITEMS[itemIndex].quantity + 1,
          };
          service.saveItem(updatedItem, index).subscribe();
          req = controller.expectOne(
            `http://localhost:3000/cart/${updatedItem.id}`
          );
          req.flush(updatedItem);
          tick(1000);
          service.cartItems$.subscribe((i) => (items = i));

          // Assert
          const updatedItems = [...ITEMS] as ICartItem[];
          updatedItems.splice(index, 1, updatedItem);
          expect(items).toEqual(updatedItems);
          controller.verify();
        }
      )();
    }));
  });

  describe('deleteItem', () => {
    it('should call http client with the correct url', inject(
      [CartService, HttpTestingController],
      (service: CartService, controller: HttpTestingController) => {
        // Arrange
        const index = 1;
        let req: TestRequest;
        req = controller.expectOne('http://localhost:3000/cart');

        // Act
        service.deleteItem(ITEMS[index]).subscribe();

        // Assert
        req = controller.expectOne(
          `http://localhost:3000/cart/${ITEMS[index].id}`
        );
        expect(req.request.method).toEqual('DELETE');
        controller.verify();
      }
    ));

    it('should not call handleError method on ErrorService', inject(
      [CartService, HttpTestingController],
      (service: CartService, controller: HttpTestingController) => {
        // Arrange
        const index = 1;
        let req: TestRequest;
        req = controller.expectOne('http://localhost:3000/cart');
        req.flush(ITEMS);

        // Act
        service.deleteItem(ITEMS[index]).subscribe();
        req = controller.expectOne(
          `http://localhost:3000/cart/${ITEMS[index].id}`
        );
        req.flush(ITEMS[index]);

        // Assert
        expect(mockErrorService.handleError).toHaveBeenCalledTimes(0);
        controller.verify();
      }
    ));

    it('should set cartItems$ correctly', fakeAsync(() => {
      inject(
        [CartService, HttpTestingController],
        (service: CartService, controller: HttpTestingController) => {
          // Arrange
          const itemIndex = 1;
          let req: TestRequest;
          let items: ICartItem[];
          req = controller.expectOne('http://localhost:3000/cart');
          req.flush(ITEMS);

          // Act
          service.deleteItem(ITEMS[itemIndex]).subscribe();
          req = controller.expectOne(
            `http://localhost:3000/cart/${ITEMS[itemIndex].id}`
          );
          req.flush(ITEMS[itemIndex]);
          tick(1000);
          service.cartItems$.subscribe((i) => (items = i));

          // Assert
          const updatedItems = ITEMS.filter(
            ({ id }) => +id !== +ITEMS[itemIndex].id
          ) as ICartItem[];
          expect(items).toEqual(updatedItems);
          controller.verify();
        }
      )();
    }));
  });

  describe('deleteAllItems', () => {
    it(`should call deleteItem method the correct number of times and with the
      correct value`, fakeAsync(() => {
      inject([CartService], (service: CartService) => {
        // Arrange
        spyOn(service, 'deleteItem').and.returnValue(of(ITEMS[0]));

        // Act
        service.deleteAllItems(ITEMS).subscribe();
        tick(ITEMS.length * 1000);

        // Assert
        expect(service.deleteItem).toHaveBeenCalledTimes(ITEMS.length);
        for (let item of ITEMS) {
          expect(service.deleteItem).toHaveBeenCalledWith(item);
        }
      })();
    }));

    // fit(`should not call handleError method on ErrorService`, fakeAsync(() => {
    //   inject(
    //     [CartService, HttpTestingController],
    //     (service: CartService, controller: HttpTestingController) => {
    //       // Arrange
    //       const index = 1;
    //       let req: TestRequest;
    //       req = controller.expectOne('http://localhost:3000/cart');
    //       req.flush(ITEMS);

    //       // Act
    //       service.deleteAllItems(ITEMS).subscribe();
    //       tick(ITEMS.length * 1000);

    //       for (let item of ITEMS) {
    //         req = controller.expectOne(`http://localhost:3000/cart/${item.id}`);
    //         // req.flush(item);
    //       }

    //       // Assert
    //       expect(mockErrorService.handleError).toHaveBeenCalledTimes(0);
    //       controller.verify();
    //     }
    //   )();
    // }));
  });
});
