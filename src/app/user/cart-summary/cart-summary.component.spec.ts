import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { CartService } from 'src/app/core/cart.service';
import { ShippingRateService } from '../shipping-rate.service';

import { ICartItem } from 'src/app/types/cart-item';

import { CartSummaryComponent } from './cart-summary.component';
import { By } from '@angular/platform-browser';
import { formatCurrency } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IShipping } from 'src/app/types/shipping';
import { Pipe, PipeTransform } from '@angular/core';

describe('CartSummaryComponent', () => {
  let component: CartSummaryComponent;
  let fixture: ComponentFixture<CartSummaryComponent>;
  let mockCartService: CartService;
  let mockShippingRateService: ShippingRateService;

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
  const QUANTITY = 3;
  const SUBTOTAL = 137.99;
  const TOTALTAX = 150.69;
  const TOTAL = 199.97;
  const SHIPPINGPRICESELECTED = 6.99;

  beforeEach(
    waitForAsync(() => {
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
        imports: [HttpClientTestingModule, ReactiveFormsModule],
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

  it('should have set items$ correctly', () => {
    let items: ICartItem[];
    fixture.detectChanges();

    component.items$.subscribe((i) => (items = i));

    expect(items.length).toEqual(3);
    expect(items).toBe(ITEMS);
  });

  it('should have set subtotal$ correctly', () => {
    let subtotal: number;
    fixture.detectChanges();

    component.subtotal$.subscribe((s) => (subtotal = s));

    expect(subtotal).toBe(SUBTOTAL);
  });

  it('should have set totalTax$ correctly', () => {
    let totalTax: number;
    fixture.detectChanges();

    component.totalTax$.subscribe((t) => (totalTax = t));

    expect(totalTax).toBe(TOTALTAX);
  });

  it('should have set total$ correctly', () => {
    let total: number;
    fixture.detectChanges();

    component.total$.subscribe((t) => (total = t));

    expect(total).toBe(TOTAL);
  });

  it('should have set shippingPrice$ correctly', () => {
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
  let mockShippingRateService;

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
  const QUANTITY = 3;
  const SUBTOTAL = 137.99;
  const TOTALTAX = 150.69;
  const TOTAL = 199.97;
  const SHIPPINGPRICESELECTED = 6.99;
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

  @Pipe({
    name: 'capitalize',
  })
  class MockCapitalizePipe implements PipeTransform {
    transform(value: string): string {
      if (value === undefined || value === null || value.length === 0) {
        return value;
      }
      const words = value.split(' ');
      const capitalizedWords = [];
      words.forEach((w) =>
        capitalizedWords.push(
          w[0].toUpperCase() + w.slice(1, w.length).toLowerCase()
        )
      );
      return capitalizedWords.join(' ');
    }
  }

  beforeEach(
    waitForAsync(() => {
      mockCartService = jasmine.createSpyObj([''], {
        tax: TAX,
        cartItems$: of(ITEMS),
        cartQuantity$: of(QUANTITY),
        subtotal$: of(SUBTOTAL),
        totalTax$: of(TOTALTAX),
        total$: of(TOTAL),
      });
      mockShippingRateService = jasmine.createSpyObj(
        ['getDeliveryDate', 'setShipping'],
        {
          shippingPriceSelectedAction$: of(SHIPPINGPRICESELECTED),
        }
      );
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, ReactiveFormsModule],
        declarations: [CartSummaryComponent, MockCapitalizePipe],
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
    component.shippingRates = SHIPPINGRATES;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set subtotal$ in the template', () => {
    // Arrange
    let subtotal: number;

    // Act
    fixture.detectChanges();
    component.subtotal$.subscribe((s) => (subtotal = s));

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('div span'));
    expect(elements[1].nativeElement.textContent).toBe(
      formatCurrency(subtotal, 'en-US', '$')
    );
  });

  it('should set totalTax$ in the template', () => {
    // Arrange
    let totalTax: number;

    // Act
    fixture.detectChanges();
    component.totalTax$.subscribe((t) => (totalTax = t));

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('div span'));
    expect(elements[3].nativeElement.textContent).toBe(
      formatCurrency(totalTax, 'en-US', '$')
    );
  });

  it('should set shippingPrice$ in the template', () => {
    // Arrange
    let shippingPrice: number;

    // Act
    fixture.detectChanges();
    component.shippingPrice$.subscribe((s) => (shippingPrice = s));

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('div span'));
    expect(elements[5].nativeElement.textContent).toBe(
      formatCurrency(shippingPrice, 'en-US', '$')
    );
  });

  xit('should set shippingRates in the template', () => {
    // Arrange
    mockShippingRateService.getDeliveryDate.and.returnValue(new Date());

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('.custom-radio'));
    expect(elements.length).toBe(component.shippingRates.length);
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i].query(By.css('input'));
      expect(element.nativeElement.id).toBe(`price${i}`);
      expect(element.nativeElement.type).toBe(`radio`);
      element = elements[i].query(By.css('label'));
      expect(element.nativeElement.for).toBe(`price${i}`);
    }
  });

  it('should set total$ in the template', () => {
    // Arrange
    let total: number;

    // Act
    fixture.detectChanges();
    component.total$.subscribe((t) => (total = t));

    // Assert
    const elements = fixture.debugElement.queryAll(
      By.css('.card-footer h5 span')
    );
    expect(elements[1].nativeElement.textContent).toBe(
      formatCurrency(total, 'en-US', '$')
    );
  });
});
