import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { ShippingRateService } from '../../services/shipping-rate.service';

import { ICartItem } from 'src/app/types/cart-item';

import { CartSummaryComponent } from './cart-summary.component';
import { By } from '@angular/platform-browser';
import { formatCurrency } from '@angular/common';

describe('CartSummaryComponent', () => {
  let component: CartSummaryComponent;
  let fixture: ComponentFixture<CartSummaryComponent>;
  let mockCartService: CartService;
  let mockShippingRateService: ShippingRateService;
  let TAX: number;
  let ITEMS: ICartItem[];
  let QUANTITY: number;
  let SUBTOTAL: number;
  let TOTALTAX: number;
  let TOTAL: number;
  let SHIPPINGPRICESELECTED: number;

  beforeEach(
    waitForAsync(() => {
      TAX = 0.0687;
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
            'With the Lenovo Idea Pad L340 gaming Laptop, you know you\'ve made the right decision with one serious laptop. Equipped with the latest Intel Core i5 processor, next-gen NVIDIA GeForce graphics, and jaw-dropping Dolby Audio, you\'ll experience first-hand real power and seamless play. You\'ll stay focused on the task at hand, concentrating on beating Your opponents and confident that your sleek, stylish computer will keep up with the competition.',
          price: 855.67,
          imageUrl: 'assets/images/ideapadL340.jpg',
          code: 'LDN-1',
          starRating: 2,
          type: 'laptops',
          brand: 'Lenovo',
          quantity: 1,
        },
      ];
      QUANTITY = ITEMS.reduce((prev, current) => {
        return +prev + +current.quantity;
      }, 0);
      SUBTOTAL = ITEMS.reduce((prev, current) => {
        return +(prev + +current.price * +current.quantity).toFixed(2);
      }, 0);
      TOTALTAX = +(SUBTOTAL * TAX).toFixed(2);
      TOTAL = +(SUBTOTAL + TOTALTAX + 6.99).toFixed(2);
      SHIPPINGPRICESELECTED = 6.99;
      mockCartService = jasmine.createSpyObj([''], {
        tax: TAX,
        cartItems$: of(ITEMS),
        cartQuantity$: of(QUANTITY),
        subtotal$: of(SUBTOTAL),
        totalTax$: of(TOTALTAX),
        total$: of(TOTAL),
      });
      mockShippingRateService = jasmine.createSpyObj([''], {
        shippingPriceSelectedAction$: of(SHIPPINGPRICESELECTED),
      });
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CartSummaryComponent],
        providers: [
          { provide: CartService, useValue: mockCartService },
          { provide: ShippingRateService, useValue: mockShippingRateService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CartSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set tax correctly from CartService', () => {
    fixture.detectChanges();

    expect(component.tax).toBe(TAX);
  });

  it('should set items$ correctly from CartService', () => {
    let items: ICartItem[];
    fixture.detectChanges();

    component.items$.subscribe((i) => (items = i));

    expect(items.length).toEqual(3);
    expect(items).toBe(ITEMS);
  });

  it('should set quantity$ correctly from CartService', () => {
    let quantity: number;
    fixture.detectChanges();

    component.quantity$.subscribe((q) => (quantity = q));

    expect(quantity).toBe(QUANTITY);
  });

  it('should set subtotal$ correctly from CartService', () => {
    let subtotal: number;
    fixture.detectChanges();

    component.subtotal$.subscribe((s) => (subtotal = s));

    expect(subtotal).toBe(SUBTOTAL);
  });

  it('should set totalTax$ correctly from CartService', () => {
    let totalTax: number;
    fixture.detectChanges();

    component.totalTax$.subscribe((t) => (totalTax = t));

    expect(totalTax).toBe(TOTALTAX);
  });

  it('should set total$ correctly from CartService', () => {
    let total: number;
    fixture.detectChanges();

    component.total$.subscribe((t) => (total = t));

    expect(total).toBe(TOTAL);
  });

  it('should set shippingPrice$ correctly from ShippingRateService', () => {
    let shippingPrice: number;
    fixture.detectChanges();

    component.shippingPrice$.subscribe((p) => (shippingPrice = p));

    expect(shippingPrice).toBe(SHIPPINGPRICESELECTED);
  });
});

describe('CartSummaryComponent w/ template', () => {
  let component: CartSummaryComponent;
  let fixture: ComponentFixture<CartSummaryComponent>;
  let mockCartService: CartService;
  let mockShippingRateService: ShippingRateService;
  let TAX: number;
  let ITEMS: ICartItem[];
  let QUANTITY: number;
  let SUBTOTAL: number;
  let TOTALTAX: number;
  let TOTAL: number;
  let SHIPPINGPRICESELECTED: number;

  beforeEach(
    waitForAsync(() => {
      TAX = 0.0687;
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
            'With the Lenovo Idea Pad L340 gaming Laptop, you know you\'ve made the right decision with one serious laptop. Equipped with the latest Intel Core i5 processor, next-gen NVIDIA GeForce graphics, and jaw-dropping Dolby Audio, you\'ll experience first-hand real power and seamless play. You\'ll stay focused on the task at hand, concentrating on beating Your opponents and confident that your sleek, stylish computer will keep up with the competition.',
          price: 855.67,
          imageUrl: 'assets/images/ideapadL340.jpg',
          code: 'LDN-1',
          starRating: 2,
          type: 'laptops',
          brand: 'Lenovo',
          quantity: 1,
        },
      ];
      QUANTITY = ITEMS.reduce((prev, current) => {
        return +prev + +current.quantity;
      }, 0);
      SUBTOTAL = ITEMS.reduce((prev, current) => {
        return +(prev + +current.price * +current.quantity).toFixed(2);
      }, 0);
      TOTALTAX = +(SUBTOTAL * TAX).toFixed(2);
      TOTAL = +(SUBTOTAL + TOTALTAX + 6.99).toFixed(2);
      SHIPPINGPRICESELECTED = 6.99;
      mockCartService = jasmine.createSpyObj([''], {
        tax: TAX,
        cartItems$: of(ITEMS),
        cartQuantity$: of(QUANTITY),
        subtotal$: of(SUBTOTAL),
        totalTax$: of(TOTALTAX),
        total$: of(TOTAL),
      });
      mockShippingRateService = jasmine.createSpyObj([''], {
        shippingPriceSelectedAction$: of(SHIPPINGPRICESELECTED),
      });
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CartSummaryComponent],
        providers: [
          { provide: CartService, useValue: mockCartService },
          { provide: ShippingRateService, useValue: mockShippingRateService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CartSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set the subtotal$ in the template', () => {
    // Arrange
    let subtotal: number;

    // Act
    fixture.detectChanges();
    component.subtotal$.subscribe((s) => (subtotal = s));

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('div span'));
    expect(elements[1].nativeElement.textContent).toContain(
      formatCurrency(subtotal, 'en-US', '$')
    );
  });

  it('should set the tax in the template', () => {
    // Arrange

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('div span'));
    expect(elements[2].nativeElement.textContent).toContain(TAX * 100);
  });

  it('should set the totalTax$ in the template', () => {
    // Arrange
    let totalTax: number;

    // Act
    fixture.detectChanges();
    component.totalTax$.subscribe((t) => (totalTax = t));

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('div span'));
    expect(elements[3].nativeElement.textContent).toContain(
      formatCurrency(totalTax, 'en-US', '$')
    );
  });

  it('should set the shippingPrice$ in the template', () => {
    // Arrange
    let shippingPrice: number;

    // Act
    fixture.detectChanges();
    component.shippingPrice$.subscribe((s) => (shippingPrice = s));

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('div span'));
    expect(elements[5].nativeElement.textContent).toContain(
      formatCurrency(shippingPrice, 'en-US', '$')
    );
  });

  it('should set the total$ in the template', () => {
    // Arrange
    let total: number;

    // Act
    fixture.detectChanges();
    component.total$.subscribe((t) => (total = t));

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('h5 span'));
    expect(elements[1].nativeElement.textContent).toContain(
      formatCurrency(total, 'en-US', '$')
    );
  });
});
