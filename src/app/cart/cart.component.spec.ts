import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../services/cart.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ShippingRateService } from '../services/shipping-rate.service';
import { ICartItem } from '../types/cart-item';
import { IShipping } from '../types/shipping';
import { By } from '@angular/platform-browser';
import { CartSummaryComponent } from './cart-summary/cart-summary.component';

describe('CartComponent', () => {
  let component: CartComponent,
    fixture: ComponentFixture<CartComponent>,
    mockCartService,
    mockShippingRateService: ShippingRateService,
    mockActivatedRoute,
    ITEMS: ICartItem[],
    SHIPPINGRATES: IShipping[];

  @Component({
    selector: 'ctacu-cart-summary',
    template: '<div></div>',
  })
  class FakeCartSummaryComponent {}

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
        { cartItems$: of(ITEMS) }
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
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],

        declarations: [CartComponent, FakeCartSummaryComponent],

        providers: [
          { provide: CartService, useValue: mockCartService },
          { provide: ShippingRateService, useValue: mockShippingRateService },

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
    expect(component).toBeTruthy();
  });

  it('should set shippingRates correctly', () => {
    expect(component.shippingRates.length).toBe(3);
    expect(component.shippingRates).toBe(SHIPPINGRATES);
  });

  it('should have no errorMessage to start', () => {
    expect(component.errorMessage).toBeFalsy();
  });

  it('should have "Cart" as pageTitle to start', () => {
    expect(component.pageTitle).toBe('Cart');
  });

  it(`should retrieve call getDeliveryDate 2 times with correct values
    ngOnInit()`, () => {
    fixture.detectChanges();

    expect(mockShippingRateService.getDeliveryDate).toHaveBeenCalledTimes(2);
    expect(mockShippingRateService.getDeliveryDate).toHaveBeenCalledWith(
      SHIPPINGRATES[0].rate
    );
    expect(mockShippingRateService.getDeliveryDate).toHaveBeenCalledWith(
      SHIPPINGRATES[2].rate
    );
  });

  it('should retrieve call setShipping ngOnInit()', () => {
    component.ngOnInit();

    expect(mockShippingRateService.setShipping).toHaveBeenCalled();
  });

  describe('updateQty', () => {
    it('should call saveItem method with the correct value when called', () => {
      mockCartService.saveItem.and.returnValue(of(ITEMS[2]));
      mockCartService.getCartItems.and.returnValue(of(ITEMS));

      component.updateQty(ITEMS[2], 0);

      expect(mockCartService.saveItem).toHaveBeenCalledWith(ITEMS[2], 0);
      expect(mockCartService.getCartItems).toHaveBeenCalled();
    });
    it('should call getCartItems method when called', () => {
      mockCartService.saveItem.and.returnValue(of(ITEMS[2]));
      mockCartService.getCartItems.and.returnValue(of(ITEMS));

      component.updateQty(ITEMS[2], 0);

      expect(mockCartService.getCartItems).toHaveBeenCalled();
    });
  });
});

describe('CartComponent w/ template', () => {
  let component: CartComponent,
    fixture: ComponentFixture<CartComponent>,
    mockCartService,
    mockShippingRateService: ShippingRateService,
    mockActivatedRoute,
    // mockRouter,
    ITEMS: ICartItem[],
    SHIPPINGRATES;

  // @Component({
  //   selector: 'ctacu-cart-summary',
  //   template: '<div></div>',
  // })
  // class FakeCartSummaryComponent {}

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
        { cartItems$: of(ITEMS) }
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
      // mockRouter = jasmine.createSpyObj(['navigate']);

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],

        declarations: [CartComponent, CartSummaryComponent],

        providers: [
          { provide: CartService, useValue: mockCartService },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          // { provide: Router, useValue: mockRouter },
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
    expect(component).toBeTruthy();
  });

  it('should set items$ in the template', () => {
    // run ngOnInit
    fixture.detectChanges();

    // item debug elements
    const elements = fixture.debugElement.queryAll(By.css('tr'));
    expect(elements.length).toEqual(ITEMS.length);
    // for (let index = 0; index < elements.length; index++) {
    //   const items = elements[index];
    //   expect(items.componentInstance.item).toEqual(ITEMS[index]);
    // }
  });

  it('should set the item name in the template', () => {
    // run ngOnInit
    fixture.detectChanges();

    // item debug elements
    const elements = fixture.debugElement.queryAll(By.css('td a'));
    expect(elements[0].nativeElement.textContent).toContain(ITEMS[0].name);
  });

  it('should set the item price in the template', () => {
    // run ngOnInit
    fixture.detectChanges();

    // item debug elements
    const elements = fixture.debugElement.queryAll(By.css('td'));
    expect(elements[2].nativeElement.textContent).toContain(ITEMS[0].price);
  });

  it('should set the item quantity in the template', () => {
    // run ngOnInit
    fixture.detectChanges();

    // item debug elements
    const elements = fixture.debugElement.queryAll(By.css('td input'));
    expect(elements[1].nativeElement.value).toContain(ITEMS[0].quantity);
  });

  it('should call openRemoveModal method when remove input button is clicked', () => {
    // Arrange
    spyOn(component, 'openRemoveModal');
    fixture.detectChanges();
    const input = fixture.debugElement.queryAll(By.css('td input'))[3];

    // Act
    input.triggerEventHandler('click', null);

    // Assert
    expect(component.openRemoveModal).toHaveBeenCalled();
  });

  xit(`should call cartService.removeItem method when remove input button is
    clicked`, () => {
    // Arrange
    fixture.detectChanges();
    mockCartService.removeItem.and.returnValue(of(ITEMS[0]));
    const input = fixture.debugElement.queryAll(By.css('td input'))[3];

    // Act
    input.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Assert
    expect(mockCartService.removeItem).toHaveBeenCalledWith(ITEMS[0]);
  });
});
