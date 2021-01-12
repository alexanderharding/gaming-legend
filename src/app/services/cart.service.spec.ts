import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { ICartItem } from '../types/cart-item';
import { CartService } from './cart.service';

describe('CartService', () => {
  let item: ICartItem;
  let items: ICartItem[];
  let itemIndex: number;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService],
      imports: [HttpClientTestingModule],
    });
  });

  it('should be created', inject([CartService], (service: CartService) => {
    expect(service).toBeTruthy();
  }));

  describe('getCartItems', () => {
    it('should call http client with the correct url', inject(
      [CartService, HttpTestingController],
      (service: CartService, controller: HttpTestingController) => {
        // Arrange

        // Act
        service.getCartItems().subscribe();

        // Assert
        controller.expectOne('http://localhost:3000/cart');
        controller.verify();
      }
    ));
  });

  describe('saveItem', () => {
    it(`should call http client with the correct url if itemIndex is less than
    0`, inject(
      [CartService, HttpTestingController],
      (service: CartService, controller: HttpTestingController) => {
        // Arrange
        item = {
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
        };
        itemIndex = -1;

        // Act
        service.saveItem(item, itemIndex).subscribe();

        // Assert
        controller.expectOne(`http://localhost:3000/cart`);
        controller.verify();
      }
    ));
    it(`should call http client with the correct url if itemIndex is greater
    than or equal to 0`, inject(
      [CartService, HttpTestingController],
      (service: CartService, controller: HttpTestingController) => {
        // Arrange
        item = {
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
        };
        itemIndex = 0;

        // Act
        service.saveItem(item, itemIndex).subscribe();

        // Assert
        controller.expectOne(`http://localhost:3000/cart/${item.id}`);
        controller.verify();
      }
    ));
  });

  describe('removeItem', () => {
    it('should call http client with the correct url', inject(
      [CartService, HttpTestingController],
      (service: CartService, controller: HttpTestingController) => {
        // Arrange
        item = {
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
        };

        // Act
        service.removeItem(item).subscribe();

        // Assert
        controller.expectOne(`http://localhost:3000/cart/${item.id}`);
        controller.verify();
      }
    ));
  });

  describe('cartItems$', () => {
    it('should have no items to start', inject(
      [CartService],
      (service: CartService) => {
        // Arrange
        items = [];

        // Act
        service.cartItems$.subscribe((cartItems) => (items = cartItems));

        // Assert
        expect(items.length).toBe(0);
      }
    ));
  });
});
