import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../services/cart.service';
import { Observable, of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ShippingRateService } from '../services/shipping-rate.service';
import { ICartItem } from '../types/cart-item';
import { IShipping } from '../types/shipping';
import { By } from '@angular/platform-browser';
import { CartSummaryComponent } from './cart-summary/cart-summary.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { NotificationService } from '../services/notification.service';
import { formatCurrency } from '@angular/common';

function getQuantity(items: ICartItem[]): number {
  return items.reduce((prev, current) => {
    return +prev + +current.quantity;
  }, 0);
}

describe('CartComponent', () => {
  let component: CartComponent,
    fixture: ComponentFixture<CartComponent>,
    mockCartService,
    mockModalService,
    mockShippingRateService,
    mockNotificationService,
    mockActivatedRoute,
    ITEMS: ICartItem[],
    SHIPPINGRATES: IShipping[],
    mockModalRef: MockNgbModalRef,
    mockErrorModalRef: MockErrorNgbModalRef;

  @Component({
    selector: 'ctacu-cart-summary',
    template: '<div></div>',
  })
  class FakeCartSummaryComponent {}

  class MockNgbModalRef {
    componentInstance = {
      prompt: undefined,
      title: undefined,
    };
    closed: Observable<any> = of(true);
  }

  class MockErrorNgbModalRef {
    componentInstance = {
      prompt: undefined,
      title: undefined,
    };
    closed: Observable<never> = throwError('error');
  }

  beforeEach(
    waitForAsync(() => {
      ITEMS = [
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
          description:
            "With the Lenovo Idea Pad L340 gaming Laptop, you know you've made the right decision with one serious laptop. Equipped with the latest Intel Core i5 processor, next-gen NVIDIA GeForce graphics, and jaw-dropping Dolby Audio, you'll experience first-hand real power and seamless play. You'll stay focused on the task at hand, concentrating on beating Your opponents and confident that your sleek, stylish computer will keep up with the competition.",
          price: 855.67,
          imageUrl: 'assets/images/ideapadL340.jpg',
          code: 'LDN-1',
          starRating: 2,
          type: 'laptops',
          brand: 'Lenovo',
          quantity: 1,
        },
      ];
      SHIPPINGRATES = [
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
      ];
      mockCartService = jasmine.createSpyObj(
        ['saveItem', 'removeItem', 'removeAllItems', 'getCartItems'],
        { cartItems$: of(ITEMS), cartQuantity$: of(getQuantity(ITEMS)) }
      );
      mockShippingRateService = jasmine.createSpyObj([
        'setShipping',
        'getDeliveryDate',
      ]);
      mockActivatedRoute = {
        snapshot: {
          data: {
            resolvedData: {
              shippingRates: SHIPPINGRATES,
            },
          },
        },
      };
      mockNotificationService = jasmine.createSpyObj(['show']);
      mockModalService = jasmine.createSpyObj(['open']);
      mockModalRef = new MockNgbModalRef();
      mockErrorModalRef = new MockErrorNgbModalRef();

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],

        declarations: [CartComponent, FakeCartSummaryComponent],

        providers: [
          { provide: CartService, useValue: mockCartService },
          { provide: ShippingRateService, useValue: mockShippingRateService },
          { provide: NgbModal, useValue: mockModalService },
          { provide: NotificationService, useValue: mockNotificationService },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set shippingRates correctly', () => {
    fixture.detectChanges();

    expect(component.shippingRates.length).toBe(3);
    expect(component.shippingRates).toBe(SHIPPINGRATES);
  });

  it('should set items$ correctly', () => {
    let items: ICartItem[];
    fixture.detectChanges();

    component.items$.subscribe((i) => (items = i));

    expect(items.length).toBe(ITEMS.length);
    expect(items).toBe(ITEMS);
  });

  it('should set quantity$ correctly', () => {
    let quantity: number;
    fixture.detectChanges();

    component.quantity$.subscribe((q) => (quantity = q));

    expect(quantity).toBe(getQuantity(ITEMS));
  });

  it('should have no errorMessage', () => {
    fixture.detectChanges();

    expect(component.errorMessage).toBeFalsy();
  });

  it(`should have 'Cart' as pageTitle to start`, () => {
    fixture.detectChanges();

    expect(component.pageTitle).toBe('Cart');
  });

  it(`should retrieve call getDeliveryDate method on ShippingRateService 2 times
    with correct values`, () => {
    fixture.detectChanges();

    expect(mockShippingRateService.getDeliveryDate).toHaveBeenCalledTimes(2);
    expect(mockShippingRateService.getDeliveryDate).toHaveBeenCalledWith(
      SHIPPINGRATES[0].rate
    );
    expect(mockShippingRateService.getDeliveryDate).toHaveBeenCalledWith(
      SHIPPINGRATES[2].rate
    );
  });

  it(`should set earliestArrival correctly`, () => {
    const date = new Date();
    mockShippingRateService.getDeliveryDate.and.returnValue(date);

    fixture.detectChanges();

    expect(component.earliestArrival).toBe(date);
  });

  it(`should set latestArrival correctly`, () => {
    const date = new Date();
    mockShippingRateService.getDeliveryDate.and.returnValue(date);

    fixture.detectChanges();

    expect(component.latestArrival).toBe(date);
  });

  it(`should call setShipping method on ShippingRateService with correct
    value`, () => {
    fixture.detectChanges();

    expect(mockShippingRateService.setShipping).toHaveBeenCalledWith(
      SHIPPINGRATES[0].price
    );
  });

  describe('updateQty', () => {
    it(`should call saveItem method on CartService with the correct value`, () => {
      const amount = 1;
      mockCartService.saveItem.and.returnValue(of(ITEMS[2]));
      mockCartService.getCartItems.and.returnValue(of(ITEMS));

      component.updateQty(ITEMS[2], amount);
      const updatedItem = {
        ...ITEMS[2],
        quantity: ITEMS[2].quantity + amount,
      } as ICartItem;

      expect(mockCartService.saveItem).toHaveBeenCalledWith(updatedItem, 0);
      expect(mockCartService.getCartItems).toHaveBeenCalled();
    });

    it(`should call show method on NotificationService when saveItem method on
      CartService returns an error`, () => {
      mockCartService.saveItem.and.returnValue(
        throwError('TEST: saveItem error')
      );

      component.updateQty(ITEMS[2], 0);

      expect(mockNotificationService.show).toHaveBeenCalled();
    });

    it('should call getCartItems method on CartService', () => {
      mockCartService.saveItem.and.returnValue(of(ITEMS[2]));
      mockCartService.getCartItems.and.returnValue(of(ITEMS));

      component.updateQty(ITEMS[2], 0);

      expect(mockCartService.getCartItems).toHaveBeenCalled();
    });

    it(`should call show method on NotificationService when getCartItems method
      on CartService returns an error`, () => {
      mockCartService.saveItem.and.returnValue(of(ITEMS[2]));
      mockCartService.getCartItems.and.returnValue(
        throwError('TEST: getCartItems error')
      );

      component.updateQty(ITEMS[2], 0);

      expect(mockCartService.saveItem).toHaveBeenCalledWith(ITEMS[2], 0);
      expect(mockCartService.getCartItems).toHaveBeenCalled();
      expect(mockNotificationService.show).toHaveBeenCalled();
    });

    it(`should call openRemoveModal method with the correct value when called
      if item quantity is less than or equal to 1 and amount equals -1`, () => {
      mockCartService.saveItem.and.returnValue(of(ITEMS[2]));
      mockCartService.getCartItems.and.returnValue(of(ITEMS));
      spyOn(component, 'openRemoveModal');

      component.updateQty(ITEMS[2], -1);

      expect(component.openRemoveModal).toHaveBeenCalledWith(ITEMS[2]);
    });
  });

  describe('openRemoveModal', () => {
    it(`should call open method on ModalService with the correct
      value`, () => {
      mockModalService.open.and.returnValue(mockModalRef);
      mockCartService.removeItem.and.returnValue(of(ITEMS[0]));
      mockCartService.getCartItems.and.returnValue(of(ITEMS));

      component.openRemoveModal(ITEMS[0]);

      expect(mockModalService.open).toHaveBeenCalledWith(ConfirmModalComponent);
    });

    it(`should call removeItem method on CartService with the correct
      value`, () => {
      mockModalService.open.and.returnValue(mockModalRef);
      mockCartService.removeItem.and.returnValue(of(ITEMS[0]));
      mockCartService.getCartItems.and.returnValue(of(ITEMS));

      component.openRemoveModal(ITEMS[0]);

      expect(mockCartService.removeItem).toHaveBeenCalledWith(ITEMS[0]);
    });

    it(`should call getCartItems method on CartService`, () => {
      mockModalService.open.and.returnValue(mockModalRef);
      mockCartService.removeItem.and.returnValue(of(ITEMS[0]));
      mockCartService.getCartItems.and.returnValue(of(ITEMS));

      component.openRemoveModal(ITEMS[0]);

      expect(mockCartService.getCartItems).toHaveBeenCalled();
    });

    it(`should call show method on NotificationService when removeItem method on
      CartService returns an error`, () => {
      mockCartService.removeItem.and.returnValue(
        throwError('TEST: removeItem error')
      );
      mockModalService.open.and.returnValue(mockModalRef);

      component.openRemoveModal(ITEMS[2]);

      expect(mockNotificationService.show).toHaveBeenCalled();
    });

    it(`should not call removeItem method on CartService when open method on
      ModalService returns mockErrorModalRef`, () => {
      mockModalService.open.and.returnValue(mockErrorModalRef);

      component.openRemoveModal(ITEMS[0]);

      expect(mockCartService.removeItem).toHaveBeenCalledTimes(0);
    });

    it(`should not call getCartItems method on CartService when open method on
      ModalService returns mockErrorModalRef`, () => {
      mockModalService.open.and.returnValue(mockErrorModalRef);

      component.openRemoveModal(ITEMS[0]);

      expect(mockCartService.getCartItems).toHaveBeenCalledTimes(0);
    });
  });

  describe('openRemoveAllModal', () => {
    it(`should call open method on ModalService with the correct
      value`, () => {
      mockModalService.open.and.returnValue(mockModalRef);
      mockCartService.removeAllItems.and.returnValue(of(true));
      mockCartService.getCartItems.and.returnValue(of(ITEMS));

      component.openRemoveAllModal(ITEMS);

      expect(mockModalService.open).toHaveBeenCalledWith(ConfirmModalComponent);
    });

    it(`should call removeAllItems method on CartService with the correct
      value`, () => {
      mockModalService.open.and.returnValue(mockModalRef);
      mockCartService.removeAllItems.and.returnValue(of(true));
      mockCartService.getCartItems.and.returnValue(of(ITEMS));

      component.openRemoveAllModal(ITEMS);

      expect(mockCartService.removeAllItems).toHaveBeenCalledWith(ITEMS);
    });

    it(`should not call removeAllItems method on CartService when open method
      on ModalService returns mockErrorModalRef`, () => {
      mockModalService.open.and.returnValue(mockErrorModalRef);

      component.openRemoveModal(ITEMS[0]);

      expect(mockCartService.removeAllItems).toHaveBeenCalledTimes(0);
      expect(mockCartService.getCartItems).toHaveBeenCalledTimes(0);
    });

    it(`should retrieve call getCartItems method on CartService`, () => {
      mockModalService.open.and.returnValue(mockModalRef);
      mockCartService.removeAllItems.and.returnValue(of(true));
      mockCartService.getCartItems.and.returnValue(of(ITEMS));

      component.openRemoveAllModal(ITEMS);

      expect(mockCartService.getCartItems).toHaveBeenCalled();
    });

    it(`should not retrieve call getCartItems method on CartService when open method
      on ModalService returns mockErrorModalRef`, () => {
      mockModalService.open.and.returnValue(mockErrorModalRef);

      component.openRemoveModal(ITEMS[0]);

      expect(mockCartService.removeAllItems).toHaveBeenCalledTimes(0);
      expect(mockCartService.getCartItems).toHaveBeenCalledTimes(0);
    });

    it(`should call show method on NotificationService when removeAllItems
      method on CartService returns an error`, () => {
      mockModalService.open.and.returnValue(mockModalRef);
      mockCartService.removeAllItems.and.returnValue(
        throwError('TEST: removeAllItems error')
      );

      component.openRemoveAllModal(ITEMS);

      expect(mockNotificationService.show).toHaveBeenCalled();
    });
  });
});

describe('CartComponent w/ template', () => {
  let component: CartComponent,
    fixture: ComponentFixture<CartComponent>,
    mockCartService,
    mockActivatedRoute,
    ITEMS: ICartItem[],
    SHIPPINGRATES;

  beforeEach(
    waitForAsync(() => {
      ITEMS = [
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
          description:
            "With the Lenovo Idea Pad L340 gaming Laptop, you know you've made the right decision with one serious laptop. Equipped with the latest Intel Core i5 processor, next-gen NVIDIA GeForce graphics, and jaw-dropping Dolby Audio, you'll experience first-hand real power and seamless play. You'll stay focused on the task at hand, concentrating on beating Your opponents and confident that your sleek, stylish computer will keep up with the competition.",
          price: 855.67,
          imageUrl: 'assets/images/ideapadL340.jpg',
          code: 'LDN-1',
          starRating: 2,
          type: 'laptops',
          brand: 'Lenovo',
          quantity: 1,
        },
      ];
      SHIPPINGRATES = [
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
      ];
      mockCartService = jasmine.createSpyObj(
        ['saveItem', 'removeItem', 'removeAllItems', 'getCartItems'],
        { cartItems$: of(ITEMS), cartQuantity$: of(getQuantity(ITEMS)) }
      );
      mockActivatedRoute = {
        snapshot: {
          data: {
            resolvedData: {
              shippingRates: SHIPPINGRATES,
            },
          },
        },
      };
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],

        declarations: [CartComponent, CartSummaryComponent],

        providers: [
          { provide: CartService, useValue: mockCartService },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set pageTitle in the template', () => {
    // run ngOnInit
    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(By.css('h4 span'));
    expect(elements[0].nativeElement.textContent).toBe(component.pageTitle);
  });

  it('should set items$ in the template', () => {
    // run ngOnInit
    fixture.detectChanges();

    // item debug elements
    const tabelRowElements = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(tabelRowElements.length).toEqual(ITEMS.length);
    for (let i = 0; i < tabelRowElements.length; i++) {
      let element: DebugElement;
      const tableCellElements = tabelRowElements[i].queryAll(By.css('td'));

      element = tableCellElements[0].query(By.css('img'));
      expect(element.nativeElement.src).toContain(ITEMS[i].imageUrl);

      element = tableCellElements[1].query(By.css('a'));
      expect(element.nativeElement.textContent).toBe(ITEMS[i].name);

      element = tableCellElements[2];
      expect(element.nativeElement.textContent).toBe(
        formatCurrency(ITEMS[i].price, 'en-US', '$')
      );

      element = tableCellElements[3].queryAll(By.css('input'))[1];
      expect(+element.nativeElement.value).toBe(ITEMS[i].quantity);
    }
  });

  it('should set CartSummaryComponent in the template', () => {
    // run ngOnInit
    fixture.detectChanges();

    const CartSummaryComponentDEs = fixture.debugElement.queryAll(
      By.directive(CartSummaryComponent)
    );
    expect(CartSummaryComponentDEs.length).toBe(1);
  });

  it('should set quantity$ in the template', () => {
    // run ngOnInit
    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(By.css('h4 span'));
    expect(+elements[1].nativeElement.textContent).toBe(getQuantity(ITEMS));
  });

  it(`should call openRemoveModal method with correct value when remove input
    button is clicked`, () => {
    // Arrange
    fixture.detectChanges();
    spyOn(component, 'openRemoveModal');
    const input = fixture.debugElement.queryAll(By.css('td input'))[3];

    // Act
    input.triggerEventHandler('click', null);

    // Assert
    expect(component.openRemoveModal).toHaveBeenCalledWith(ITEMS[0]);
  });

  it(`should call openRemoveAllModal method with correct value when empty
    input button is clicked`, () => {
    // Arrange
    spyOn(component, 'openRemoveAllModal');
    fixture.detectChanges();
    const input = fixture.debugElement.queryAll(By.css('input'))[1];

    // Act
    input.triggerEventHandler('click', null);

    // Assert
    expect(component.openRemoveAllModal).toHaveBeenCalledWith(ITEMS);
  });

  it(`should call updateQty method with correct value when decrease input button
    is clicked`, () => {
    // Arrange
    spyOn(component, 'updateQty');
    fixture.detectChanges();
    const input = fixture.debugElement.queryAll(By.css('td input'))[0];

    // Act
    input.triggerEventHandler('click', null);

    // Assert
    expect(component.updateQty).toHaveBeenCalledWith(ITEMS[0], -1);
  });

  it(`should call updateQty method with correct value when increase input button
    is clicked`, () => {
    // Arrange
    spyOn(component, 'updateQty');
    fixture.detectChanges();
    const input = fixture.debugElement.queryAll(By.css('td input'))[2];

    // Act
    input.triggerEventHandler('click', null);

    // Assert
    expect(component.updateQty).toHaveBeenCalledWith(ITEMS[0], 1);
  });
});
