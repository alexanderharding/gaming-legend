import {
  Component,
  DebugElement,
  Input,
  NO_ERRORS_SCHEMA,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { Observable, of, throwError } from 'rxjs';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { ShippingRateService } from '../../services/shipping-rate.service';
import { ICartItem } from '../../types/cart-item';
import { IShipping } from '../../types/shipping';

import { By, Title } from '@angular/platform-browser';
import { CartSummaryComponent } from '../cart-summary/cart-summary.component';
import {
  NgbModal,
  NgbModalConfig,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ShippingRatesResult } from '../../types/shipping-rates-result';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { NotificationService } from '../../services/notification.service';
import { formatCurrency } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

function getQuantity(items: ICartItem[]): number {
  return items.reduce((prev, current) => {
    return +prev + +current.quantity;
  }, 0);
}

@Pipe({
  name: 'capitalize',
})
class MockCapitalizePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('CartComponent', () => {
  @Component({
    selector: 'ctacu-cart-summary',
    template: '<div></div>',
  })
  class FakeCartSummaryComponent {
    @Input() shippingRates: IShipping[];
  }
  class MockNgbModalRef {
    componentInstance = {
      title: undefined,
      message: undefined,
      warningMessage: undefined,
      infoMessage: undefined,
      type: undefined,
      closeMessage: undefined,
      dismissMessage: undefined,
    };
    closed: Observable<any> = of(true);
  }
  class MockErrorNgbModalRef {
    componentInstance = {
      title: undefined,
      message: undefined,
      warningMessage: undefined,
      infoMessage: undefined,
      type: undefined,
      closeMessage: undefined,
      dismissMessage: undefined,
    };
    closed: Observable<never> = throwError('error');
  }

  describe('w/ SHIPPINGRATES', () => {
    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let mockCartService;
    let mockNgbModal;
    let mockNgbModalConfig;
    let mockShippingRateService;
    let mockNotificationService;
    let mockActivatedRoute;
    let mockModalRef: MockNgbModalRef;
    let mockErrorModalRef: MockErrorNgbModalRef;
    let mockTitle: Title;

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
        description: `With the Lenovo Idea Pad L340 gaming Laptop, you know
            you've made the right decision with one serious laptop. Equipped
            with the latest Intel Core i5 processor, next-gen NVIDIA GeForce
            graphics, and jaw-dropping Dolby Audio, you'll experience first-hand
            real power and seamless play. You'll stay focused on the task at
            hand, concentrating on beating Your opponents and confident that
            your sleek, stylish computer will keep up with the competition.`,
        price: 855.67,
        imageUrl: 'assets/images/ideapadL340.jpg',
        code: 'LDN-1',
        starRating: 2,
        type: 'laptops',
        brand: 'Lenovo',
        quantity: 1,
      },
    ];
    const RESOLVEDDATA: ShippingRatesResult = {
      shippingRates: SHIPPINGRATES,
    };

    beforeEach(
      waitForAsync(() => {
        mockCartService = jasmine.createSpyObj(
          ['saveItem', 'removeItem', 'removeAllItems', 'getCartItems'],
          { cartItems$: of(ITEMS), cartQuantity$: of(getQuantity(ITEMS)) }
        );
        mockShippingRateService = jasmine.createSpyObj([
          'setShipping',
          'getDeliveryDate',
        ]);
        mockNgbModal = jasmine.createSpyObj(['']);
        mockActivatedRoute = jasmine.createSpyObj([], {
          snapshot: {
            data: {
              resolvedData: RESOLVEDDATA,
            },
          },
        });
        mockTitle = jasmine.createSpyObj(['setTitle']);
        mockNotificationService = jasmine.createSpyObj(['show']);
        mockNgbModal = jasmine.createSpyObj(['open']);
        mockNgbModalConfig = jasmine.createSpyObj([], {
          centered: false,
          backdrop: true,
        });
        mockModalRef = new MockNgbModalRef();
        mockErrorModalRef = new MockErrorNgbModalRef();

        TestBed.configureTestingModule({
          imports: [
            HttpClientTestingModule,
            RouterTestingModule,
            NgbModule,
            FormsModule,
          ],
          declarations: [
            CartComponent,
            FakeCartSummaryComponent,
            MockCapitalizePipe,
          ],
          providers: [
            { provide: CartService, useValue: mockCartService },
            {
              provide: ShippingRateService,
              useValue: mockShippingRateService,
            },
            { provide: ActivatedRoute, useValue: mockActivatedRoute },
            { provide: NgbModal, useValue: mockNgbModal },
            { provide: NgbModalConfig, useValue: mockNgbModalConfig },

            {
              provide: NotificationService,
              useValue: mockNotificationService,
            },
            { provide: Title, useValue: mockTitle },
          ],
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

    it(`should have set pageTitle correctly`, () => {
      fixture.detectChanges();

      expect(component.pageTitle).toBe('Review Cart');
    });

    it('should have set loading$ correctly', () => {
      let loading: boolean;
      fixture.detectChanges();

      component.loading$.subscribe((l) => (loading = l));

      expect(loading).toBeFalse();
    });

    it('should have set shippingRates correctly', () => {
      fixture.detectChanges();

      expect(component.shippingRates.length).toBe(SHIPPINGRATES.length);
      expect(component.shippingRates).toBe(SHIPPINGRATES);
    });

    it('should have set errorMessage correctly', () => {
      fixture.detectChanges();

      expect(component.errorMessage).toBeUndefined();
    });

    it('should have set items$ correctly', () => {
      let items: ICartItem[];
      fixture.detectChanges();

      component.items$.subscribe((i) => (items = i));

      expect(items.length).toBe(ITEMS.length);
      expect(items).toBe(ITEMS);
    });

    it('should have called setTitle method on Title with correct value', () => {
      // Arrange

      // Act
      fixture.detectChanges();

      // Assert
      expect(mockTitle.setTitle).toHaveBeenCalledTimes(1);
      expect(mockTitle.setTitle).toHaveBeenCalledWith(
        `Gaming Legend | ${component.pageTitle}`
      );
    });

    describe('saveItem', () => {
      it(`should call saveItem method on CartService with correct value when
        quantity is greater than 0`, () => {
        let quantity: number;
        mockCartService.saveItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        quantity = 1;
        component.saveItem(ITEMS[2], quantity);

        const updatedItem = {
          ...ITEMS[2],
          quantity,
        } as ICartItem;
        expect(mockCartService.saveItem).toHaveBeenCalledOnceWith(
          updatedItem,
          0
        );
      });

      it(`should not call saveItem method on CartService when quantity is less
        than or equal to 0`, () => {
        let quantity: number;
        mockCartService.getCartItems.and.returnValue(of(true));
        mockCartService.removeItem.and.returnValue(of(true));
        mockNgbModal.open.and.returnValue(mockModalRef);
        fixture.detectChanges();

        quantity = 0;
        component.saveItem(ITEMS[2], quantity);

        expect(mockCartService.saveItem).toHaveBeenCalledTimes(0);
      });

      it(`should retrieve call getCartItems method on CartService when quantity
        is less than or equal to 0`, () => {
        let quantity: number;
        mockCartService.saveItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        mockCartService.removeItem.and.returnValue(of(true));
        mockNgbModal.open.and.returnValue(mockModalRef);
        fixture.detectChanges();

        quantity = 0;
        component.saveItem(ITEMS[2], quantity);

        expect(mockCartService.getCartItems).toHaveBeenCalledTimes(1);
      });

      it(`should retrieve call getCartItems method on CartService when quantity
        is greater than 0`, () => {
        let quantity: number;
        mockCartService.saveItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        quantity = 1;
        component.saveItem(ITEMS[2], quantity);

        expect(mockCartService.getCartItems).toHaveBeenCalledTimes(1);
      });

      it(`should not call getCartItems method on CartService when saveItem
        method on CartService returns an error`, () => {
        let quantity: number;
        mockCartService.saveItem.and.returnValue(throwError(''));
        fixture.detectChanges();

        quantity = 1;
        component.saveItem(ITEMS[2], quantity);

        expect(mockCartService.getCartItems).toHaveBeenCalledTimes(0);
      });

      it(`should not call getCartItems method on CartService when removeItem
        method on CartService returns an error`, () => {
        let quantity: number;
        mockCartService.removeItem.and.returnValue(throwError(''));
        mockNgbModal.open.and.returnValue(mockModalRef);
        fixture.detectChanges();

        quantity = 0;
        component.saveItem(ITEMS[2], quantity);

        expect(mockCartService.getCartItems).toHaveBeenCalledTimes(0);
      });

      it(`should call removeItem method on CartService with correct value when
        quantity is less than or equal to 0`, () => {
        let quantity: number;
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.getCartItems.and.returnValue(of(true));
        mockCartService.removeItem.and.returnValue(of(true));
        fixture.detectChanges();

        quantity = 0;
        component.saveItem(ITEMS[2], quantity);

        expect(mockCartService.removeItem).toHaveBeenCalledOnceWith(ITEMS[2]);
      });

      it(`should not call removeItem method on CartService with correct value
        when quantity is greater than 0`, () => {
        let quantity: number;
        mockCartService.saveItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        quantity = 1;
        component.saveItem(ITEMS[2], quantity);

        expect(mockCartService.removeItem).toHaveBeenCalledTimes(0);
      });

      it(`should call removeItem method on CartSevice with correct value when
        quantity equals 0`, () => {
        const index = 0;
        let quantity: number;
        mockCartService.removeItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        quantity = 0;
        component.saveItem(ITEMS[index], quantity);

        expect(mockCartService.removeItem).toHaveBeenCalledOnceWith(
          ITEMS[index]
        );
      });

      it(`should not call removeItem method on CartSevice when quantity is
        greater than 0`, () => {
        const index = 2;
        let quantity: number;
        mockCartService.saveItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        quantity = 1;
        component.saveItem(ITEMS[index], quantity);

        expect(mockCartService.removeItem).toHaveBeenCalledTimes(0);
      });

      it(`should not call show method on NotificationService`, () => {
        const index = 2;
        let quantity: number;
        mockCartService.saveItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        mockCartService.removeItem.and.returnValue(of(true));
        mockNgbModal.open.and.returnValue(mockModalRef);
        fixture.detectChanges();

        quantity = 1;
        component.saveItem(ITEMS[index], quantity);

        expect(mockNotificationService.show).toHaveBeenCalledTimes(0);

        quantity = 0;
        component.saveItem(ITEMS[index], quantity);

        expect(mockNotificationService.show).toHaveBeenCalledTimes(0);
      });

      it(`should call show method on NotificationService with correct value when
        saveItem method on CartService returns an error`, () => {
        const index = 2;
        let quantity: number;
        mockCartService.saveItem.and.returnValue(throwError(''));
        fixture.detectChanges();

        quantity = 1;
        component.saveItem(ITEMS[index], quantity);

        expect(mockNotificationService.show).toHaveBeenCalledOnceWith({
          textOrTpl: `Error updating ${ITEMS[index].name} !`,
          className: 'bg-danger text-light',
          delay: 15000,
        });
      });

      it(`should call show method on NotificationService with correct value when
        getCartItems method on CartService returns an error`, () => {
        let quantity: number;
        mockCartService.saveItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(throwError(''));
        fixture.detectChanges();

        quantity = 1;
        component.saveItem(ITEMS[1], quantity);

        expect(mockNotificationService.show).toHaveBeenCalledOnceWith({
          textOrTpl: 'Error retrieving cart !',
          className: 'bg-danger text-light',
          delay: 15000,
        });
      });

      it(`should call show method on NotificationService with correct value when
        removeItem method on CartService returns an error`, () => {
        const index = 0;
        let quantity: number;
        mockCartService.removeItem.and.returnValue(throwError(''));
        mockNgbModal.open.and.returnValue(mockModalRef);
        fixture.detectChanges();

        quantity = 0;
        component.saveItem(ITEMS[index], quantity);

        expect(mockNotificationService.show).toHaveBeenCalledOnceWith({
          textOrTpl: `Error removing ${ITEMS[index].name} !`,
          className: 'bg-danger text-light',
          delay: 15000,
        });
      });
    });

    describe('openRemoveAllModal', () => {
      it(`should call open method on ModalService with correct
       value`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.removeAllItems.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.openRemoveAllModal(ITEMS);

        expect(mockNgbModal.open).toHaveBeenCalledOnceWith(
          ConfirmModalComponent
        );
      });

      it(`should call removeAllItems method on CartService with correct
        value`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.removeAllItems.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.openRemoveAllModal(ITEMS);

        expect(mockCartService.removeAllItems).toHaveBeenCalledOnceWith(ITEMS);
      });

      it(`should not call removeAllItems method on CartService when open method
        on ModalService returns mockErrorModalRef`, () => {
        mockNgbModal.open.and.returnValue(mockErrorModalRef);
        fixture.detectChanges();

        component.openRemoveAllModal(ITEMS);

        expect(mockCartService.removeAllItems).toHaveBeenCalledTimes(0);
      });

      it(`should retrieve call getCartItems method on CartService`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.removeAllItems.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.openRemoveAllModal(ITEMS);

        expect(mockCartService.getCartItems).toHaveBeenCalledTimes(1);
      });

      it(`should not call getCartItems method on CartService when open method
        on ModalService returns mockErrorModalRef`, () => {
        mockNgbModal.open.and.returnValue(mockErrorModalRef);
        fixture.detectChanges();

        component.openRemoveAllModal(ITEMS);

        expect(mockCartService.getCartItems).toHaveBeenCalledTimes(0);
      });

      it(`should not call show method on NotificationService`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.removeAllItems.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.openRemoveAllModal(ITEMS);

        expect(mockNotificationService.show).toHaveBeenCalledTimes(0);
      });

      it(`should call show method on NotificationService with correct value when
        removeAllItems method on CartService returns an error`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.getCartItems.and.returnValue(of(true));
        mockCartService.removeAllItems.and.returnValue(throwError(''));
        fixture.detectChanges();

        component.openRemoveAllModal(ITEMS);

        expect(mockNotificationService.show).toHaveBeenCalledOnceWith({
          textOrTpl: 'Error emptying cart !',
          className: 'bg-danger text-light',
          delay: 15000,
        });
      });

      it(`should call show method on NotificationService with correct value when
        getCartItems method on CartService returns an error`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.removeAllItems.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(throwError(''));
        fixture.detectChanges();

        component.openRemoveAllModal(ITEMS);

        expect(mockNotificationService.show).toHaveBeenCalledOnceWith({
          textOrTpl: 'Error retrieving cart !',
          className: 'bg-danger text-light',
          delay: 15000,
        });
      });

      it('should set componentInstance properties on mockModalRef', () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.removeAllItems.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.openRemoveAllModal(ITEMS);

        expect(mockModalRef.componentInstance.title).toBe('Empty Cart');
        expect(mockModalRef.componentInstance.message).toBe(
          `Are you sure you want to empty the cart?`
        );
        expect(mockModalRef.componentInstance.warningMessage).toBe(
          'This operation can not be undone.'
        );
        expect(mockModalRef.componentInstance.infoMessage).toBeUndefined();
        expect(mockModalRef.componentInstance.type).toBe('bg-danger');
        expect(mockModalRef.componentInstance.closeMessage).toBe('empty');
        expect(mockModalRef.componentInstance.dismissMessage).toBeUndefined();
      });
    });
  });

  describe('w/o SHIPPINGRATES', () => {
    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let mockCartService;
    let mockShippingRateService;
    let mockActivatedRoute;
    let mockTitle: Title;

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
        description: `With the Lenovo Idea Pad L340 gaming Laptop, you know
            you've made the right decision with one serious laptop. Equipped
            with the latest Intel Core i5 processor, next-gen NVIDIA GeForce
            graphics, and jaw-dropping Dolby Audio, you'll experience first-hand
            real power and seamless play. You'll stay focused on the task at
            hand, concentrating on beating Your opponents and confident that
            your sleek, stylish computer will keep up with the competition.`,
        price: 855.67,
        imageUrl: 'assets/images/ideapadL340.jpg',
        code: 'LDN-1',
        starRating: 2,
        type: 'laptops',
        brand: 'Lenovo',
        quantity: 1,
      },
    ];
    const ERRORMESSAGE = 'Error!';
    const RESOLVEDDATA: ShippingRatesResult = {
      shippingRates: null,
      error: ERRORMESSAGE,
    };

    beforeEach(
      waitForAsync(() => {
        mockCartService = jasmine.createSpyObj([], {
          cartItems$: of(ITEMS),
          cartQuantity$: of(getQuantity(ITEMS)),
        });
        mockShippingRateService = jasmine.createSpyObj([
          'setShipping',
          'getDeliveryDate',
        ]);
        mockActivatedRoute = jasmine.createSpyObj([], {
          snapshot: {
            data: {
              resolvedData: RESOLVEDDATA,
            },
          },
        });
        mockTitle = jasmine.createSpyObj(['setTitle']);
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule, NgbModule],

          declarations: [
            CartComponent,
            FakeCartSummaryComponent,
            MockCapitalizePipe,
          ],

          providers: [
            { provide: CartService, useValue: mockCartService },
            {
              provide: ShippingRateService,
              useValue: mockShippingRateService,
            },
            { provide: ActivatedRoute, useValue: mockActivatedRoute },
            { provide: Title, useValue: mockTitle },
          ],
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

    it('should have set pageTitle correctly', () => {
      fixture.detectChanges();

      expect(component.pageTitle).toBe('Retrieval Error');
    });

    it('should have set loading$ correctly', () => {
      let loading: boolean;
      fixture.detectChanges();

      component.loading$.subscribe((l) => (loading = l));

      expect(loading).toBeFalse();
    });

    it('should have set shippingRates correctly', () => {
      fixture.detectChanges();

      expect(component.shippingRates).toBeNull();
    });

    it('should have set errorMessage correctly', () => {
      fixture.detectChanges();

      expect(component.errorMessage).toBe(ERRORMESSAGE);
    });

    it('should have set items$ correctly', () => {
      let items: ICartItem[];
      fixture.detectChanges();

      component.items$.subscribe((i) => (items = i));

      expect(items.length).toBe(ITEMS.length);
      expect(items).toBe(ITEMS);
    });

    it('should have called setTitle method on Title with correct value', () => {
      // Arrange

      // Act
      fixture.detectChanges();

      // Assert
      expect(mockTitle.setTitle).toHaveBeenCalledOnceWith(
        `Gaming Legend | ${component.pageTitle}`
      );
    });
  });
});

describe('CartComponent w/ template', () => {
  describe('w/ SHIPPINGRATES', () => {
    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let mockCartService;
    let mockNgbModal;
    let mockNgbModalConfig;
    let mockActivatedRoute;
    let mockShippingRateService;
    let mockNotificationService;

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
        quantity: 2,
      },
      {
        id: 1,
        name: 'Ideapad L340',
        brandId: 1,
        description: `With the Lenovo Idea Pad L340 gaming Laptop, you know
            you've made the right decision with one serious laptop. Equipped
            with the latest Intel Core i5 processor, next-gen NVIDIA GeForce
            graphics, and jaw-dropping Dolby Audio, you'll experience first-hand
            real power and seamless play. You'll stay focused on the task at
            hand, concentrating on beating Your opponents and confident that
            your sleek, stylish computer will keep up with the competition.`,
        price: 855.67,
        imageUrl: 'assets/images/ideapadL340.jpg',
        code: 'LDN-1',
        starRating: 2,
        type: 'laptops',
        brand: 'Lenovo',
        quantity: 1,
      },
    ];
    const RESOLVEDDATA: ShippingRatesResult = {
      shippingRates: SHIPPINGRATES,
    };

    beforeEach(
      waitForAsync(() => {
        mockCartService = jasmine.createSpyObj(
          ['saveItem', 'removeItem', 'removeAllItems', 'getCartItems'],
          { cartItems$: of(ITEMS), cartQuantity$: of(getQuantity(ITEMS)) }
        );
        mockActivatedRoute = jasmine.createSpyObj([], {
          snapshot: {
            data: {
              resolvedData: RESOLVEDDATA,
            },
          },
        });
        mockNgbModal = jasmine.createSpyObj(['']);
        mockNotificationService = jasmine.createSpyObj(['']);
        mockNgbModalConfig = jasmine.createSpyObj([], {
          centered: false,
          backdrop: true,
        });
        mockShippingRateService = jasmine.createSpyObj(
          ['setShipping', 'getDeliveryDate'],
          { shippingPriceSelectedAction$: of(SHIPPINGRATES[0].price) }
        );
        TestBed.configureTestingModule({
          imports: [
            HttpClientTestingModule,
            ReactiveFormsModule,
            FormsModule,
            RouterTestingModule,
          ],

          declarations: [
            CartComponent,
            CartSummaryComponent,
            MockCapitalizePipe,
          ],

          providers: [
            { provide: CartService, useValue: mockCartService },
            {
              provide: ShippingRateService,
              useValue: mockShippingRateService,
            },
            { provide: ActivatedRoute, useValue: mockActivatedRoute },
            { provide: NgbModal, useValue: mockNgbModal },
            { provide: NgbModalConfig, useValue: mockNgbModalConfig },

            {
              provide: NotificationService,
              useValue: mockNotificationService,
            },
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
      let elements: DebugElement[];
      fixture.detectChanges();

      elements = fixture.debugElement.queryAll(By.css('h1'));
      expect(elements.length).toBe(1);
      expect(elements[0].classes).toEqual({
        'text-light': true,
        'display-4': true,
        'd-none': true,
        'd-sm-block': true,
      });
      expect(elements[0].nativeElement.textContent).toBe(component.pageTitle);
      elements = fixture.debugElement.queryAll(By.css('h2'));
      expect(elements.length).toBe(1);
      expect(elements[0].classes).toEqual({
        'text-light': true,
        'd-sm-none': true,
      });
      expect(elements[0].nativeElement.textContent).toBe(component.pageTitle);
    });

    it('should not set errorMessage in the template', () => {
      // run ngOnInit
      fixture.detectChanges();

      const elements = fixture.debugElement.queryAll(By.css('ngb-alert'));
      expect(elements.length).toBe(0);
    });

    it('should set items$ in the template', () => {
      let items: ICartItem[];
      // run ngOnInit
      fixture.detectChanges();
      component.items$.subscribe((i) => (items = i));

      // item debug elements
      const tabelRowElements = fixture.debugElement.queryAll(
        By.css('tbody tr')
      );
      expect(tabelRowElements.length).toEqual(items.length);
      for (let i = 0; i < tabelRowElements.length; i++) {
        let element: DebugElement;
        const tableCellElements = tabelRowElements[i].queryAll(By.css('td'));

        element = tableCellElements[0].query(By.css('img'));
        expect(element.nativeElement.src).toContain(items[i].imageUrl);
        expect(element.nativeElement.title).toBe(items[i].name);

        element = tableCellElements[1].query(By.css('a'));
        expect(element.nativeElement.textContent).toBe(items[i].name);

        element = tableCellElements[2].query(By.css('span'));
        expect(element.nativeElement.textContent).toBe(
          formatCurrency(items[i].price, 'en-US', '$')
        );

        element = tableCellElements[3].query(By.css('select'));
        expect(+element.nativeElement.getAttribute('ng-reflect-model')).toBe(
          items[i].quantity
        );
      }
    });

    it('should set items$ hrefs in the template', () => {
      let items: ICartItem[];
      // run ngOnInit
      fixture.detectChanges();
      component.items$.subscribe((i) => (items = i));

      // item debug elements
      const tabelRowElements = fixture.debugElement.queryAll(
        By.css('tbody tr')
      );
      expect(tabelRowElements.length).toEqual(items.length);
      for (let i = 0; i < tabelRowElements.length; i++) {
        let href: string;
        let path: string;
        const routerLinkWithHrefElements = tabelRowElements[i].queryAll(
          By.directive(RouterLinkWithHref)
        );

        path = `/products/${items[i].type}/${items[i].id}?returnLink=%2Fuser%2Fcart`;
        expect(routerLinkWithHrefElements.length).toBe(2);
        href = routerLinkWithHrefElements[0].nativeElement.getAttribute('href');
        expect(href).toBe(path);
        href = routerLinkWithHrefElements[1].nativeElement.getAttribute('href');
        expect(href).toBe(path);
      }
    });

    it(`should set checkout input button's routerLink path in the
      template`, () => {
      fixture.detectChanges();

      const buttonDE = fixture.debugElement.queryAll(By.css('#checkoutBtn'));

      expect(buttonDE.length).toBe(1);
      expect(buttonDE[0].nativeElement.getAttribute('routerLink')).toBe(
        '../checkout'
      );
    });

    it('should set CartSummaryComponent in the template', () => {
      // run ngOnInit
      fixture.detectChanges();

      const CartSummaryComponentDEs = fixture.debugElement.queryAll(
        By.directive(CartSummaryComponent)
      );
      expect(CartSummaryComponentDEs.length).toBe(1);
      expect(CartSummaryComponentDEs[0].componentInstance.shippingRates).toBe(
        component.shippingRates
      );
    });

    it(`should call openRemoveAllModal method with correct value when empty
      input button is clicked`, () => {
      // Arrange
      let items: ICartItem[];
      spyOn(component, 'openRemoveAllModal');
      fixture.detectChanges();
      component.items$.subscribe((i) => (items = i as ICartItem[]));

      // Act
      const input = fixture.debugElement.queryAll(By.css('#removeAllBtn'));
      input[0].triggerEventHandler('click', null);

      // Assert
      expect(input.length).toBe(1);
      expect(component.openRemoveAllModal).toHaveBeenCalledOnceWith(items);
    });

    xit(`should call saveItem method with correct value when select value
      changes`, () => {
      // Arrange
      let items: ICartItem[];
      const index = 1;
      spyOn(component, 'saveItem');
      fixture.detectChanges();
      component.items$.subscribe((i) => (items = i as ICartItem[]));

      // Act
      const selectDEs = fixture.debugElement.queryAll(By.css(`#option1`));
      selectDEs[0].triggerEventHandler('click', null);

      // Assert
      expect(selectDEs.length).toBe(items.length);
      expect(component.saveItem).toHaveBeenCalledOnceWith(
        items[index],
        items[index].quantity - 1
      );
    });
  });

  describe('w/o SHIPPINGRATES', () => {
    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let mockCartService;
    let mockActivatedRoute;

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
        description: `With the Lenovo Idea Pad L340 gaming Laptop, you know
            you've made the right decision with one serious laptop. Equipped
            with the latest Intel Core i5 processor, next-gen NVIDIA GeForce
            graphics, and jaw-dropping Dolby Audio, you'll experience first-hand
            real power and seamless play. You'll stay focused on the task at
            hand, concentrating on beating Your opponents and confident that
            your sleek, stylish computer will keep up with the competition.`,
        price: 855.67,
        imageUrl: 'assets/images/ideapadL340.jpg',
        code: 'LDN-1',
        starRating: 2,
        type: 'laptops',
        brand: 'Lenovo',
        quantity: 1,
      },
    ];
    const ERRORMESSAGE = 'Error!';
    const RESOLVEDDATA: ShippingRatesResult = {
      shippingRates: null,
      error: ERRORMESSAGE,
    };

    beforeEach(
      waitForAsync(() => {
        mockCartService = jasmine.createSpyObj(
          ['saveItem', 'removeItem', 'removeAllItems', 'getCartItems'],
          { cartItems$: of(ITEMS), cartQuantity$: of(getQuantity(ITEMS)) }
        );
        mockActivatedRoute = jasmine.createSpyObj([], {
          snapshot: {
            data: {
              resolvedData: RESOLVEDDATA,
            },
          },
        });
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],

          declarations: [
            CartComponent,
            CartSummaryComponent,
            MockCapitalizePipe,
          ],

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
      let elements: DebugElement[];
      fixture.detectChanges();

      elements = fixture.debugElement.queryAll(By.css('h1'));
      expect(elements.length).toBe(1);
      expect(elements[0].classes).toEqual({
        'text-danger': true,
        'display-4': true,
        'd-none': true,
        'd-sm-block': true,
      });
      expect(elements[0].nativeElement.textContent).toBe(component.pageTitle);
      elements = fixture.debugElement.queryAll(By.css('h2'));
      expect(elements.length).toBe(1);
      expect(elements[0].classes).toEqual({
        'text-danger': true,
        'd-sm-none': true,
      });
      expect(elements[0].nativeElement.textContent).toBe(component.pageTitle);
    });

    it('should set errorMessage in the template', () => {
      // run ngOnInit
      fixture.detectChanges();

      const elements = fixture.debugElement.queryAll(By.css('ngb-alert'));
      expect(elements.length).toBe(1);
      expect(elements[0].nativeElement.textContent).toBe(
        component.errorMessage
      );
      expect(elements[0].classes).toEqual({
        'text-center': true,
      });
    });

    it('should not set items$ in the template', () => {
      // run ngOnInit
      fixture.detectChanges();

      // item debug elements
      const tabelRowElements = fixture.debugElement.queryAll(
        By.css('tbody tr')
      );
      expect(tabelRowElements.length).toBe(0);
    });

    it('should not set CartSummaryComponent in the template', () => {
      // run ngOnInit
      fixture.detectChanges();

      const CartSummaryComponentDEs = fixture.debugElement.queryAll(
        By.directive(CartSummaryComponent)
      );
      expect(CartSummaryComponentDEs.length).toBe(0);
    });
  });
});
