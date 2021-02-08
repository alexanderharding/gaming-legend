import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Order } from '../types/order';

import { OrderService } from './order.service';

describe('OrderService', () => {
  let ORDER: Order;

  beforeEach(() => {
    ORDER = {
      customer: {
        firstName: 'John',
        lastName: 'Doe',
        phone: '8011231234',
        email: 'test@test.com',
        street: '123 S Bend Ct',
        city: 'Las Vegas',
        state: 'Nevada',
        zip: '12345',
        country: 'USA',
      },
      items: [
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
      ],
      payment: {
        cardNumber: 4123147523147547,
        cvv: 123,
        expiringMonth: 7,
        expiringYear: 2021,
        subtotal: 3805.65,
        tax: 261.45,
        shipping: 6.99,
        total: 4074.09,
      },
      date: 'Tue Jan 12 2021 15:04:54 GMT-0700 (Mountain Standard Time)',
      status: 'pending',
    };
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
        ORDER = {
          ...ORDER,
          id: 1,
        };

        // Act
        service.getOrder(ORDER.id).subscribe();

        // Assert
        const req = controller.expectOne(
          `http://localhost:3000/orders/${ORDER.id}`
        );
        expect(req.request.method).toEqual('GET');
        controller.verify();
        req.flush({ order: ORDER });
      }
    ));
  });

  describe('saveOrder', () => {
    it(`should call http client with the correct url when order has no id`, inject(
      [OrderService, HttpTestingController],
      (service: OrderService, controller: HttpTestingController) => {
        // Arrange

        // Act
        service.saveOrder(ORDER).subscribe();

        // Assert
        const req = controller.expectOne(`http://localhost:3000/orders`);
        expect(req.request.method).toEqual('POST');
        controller.verify();
        req.flush({ order: ORDER });
      }
    ));
    it(`should call http client with the correct url when order has an id`, inject(
      [OrderService, HttpTestingController],
      (service: OrderService, controller: HttpTestingController) => {
        // Arrange
        ORDER = {
          ...ORDER,
          id: 1,
        };

        // Act
        service.saveOrder(ORDER).subscribe();

        // Assert
        const req = controller.expectOne(
          `http://localhost:3000/orders/${ORDER.id}`
        );
        expect(req.request.method).toEqual('PUT');
        controller.verify();
        req.flush({ order: ORDER });
      }
    ));
  });
});
