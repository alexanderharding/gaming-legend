import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { Observable, of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
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
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { NotificationService } from '../../services/notification.service';
import { formatCurrency, formatDate } from '@angular/common';
import { AppRoutingModule } from '../../app-routing.module';

function getQuantity(items: ICartItem[]): number {
  return items.reduce((prev, current) => {
    return +prev + +current.quantity;
  }, 0);
}

describe('CartComponent', () => {
  describe('w/ SHIPPINGRATES', () => {
    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let mockCartService;
    let mockNgbModal;
    let mockNgbModalConfig;
    let mockShippingRateService;
    let mockNotificationService;
    let mockActivatedRoute;
    let ITEMS: ICartItem[];
    let RESOLVEDDATA: ShippingRatesResult;
    let mockModalRef: MockNgbModalRef;
    let mockErrorModalRef: MockErrorNgbModalRef;
    let mockTitle: Title;

    const SHIPPINGRATES: IShipping[] = [
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

    @Component({
      selector: 'ctacu-cart-summary',
      template: '<div></div>',
    })
    class FakeCartSummaryComponent {}

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
                body:
                  'Powerful eight-core, sixteen-way processing performance.',
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
        mockCartService = jasmine.createSpyObj(
          ['saveItem', 'removeItem', 'removeAllItems', 'getCartItems'],
          { cartItems$: of(ITEMS), cartQuantity$: of(getQuantity(ITEMS)) }
        );
        mockShippingRateService = jasmine.createSpyObj([
          'setShipping',
          'getDeliveryDate',
        ]);
        mockNgbModal = jasmine.createSpyObj(['']);
        RESOLVEDDATA = {
          shippingRates: SHIPPINGRATES,
        };
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
          imports: [HttpClientTestingModule, AppRoutingModule],

          declarations: [CartComponent, FakeCartSummaryComponent],

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
          // schemas: [NO_ERRORS_SCHEMA],
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

    it('should have set shippingRates correctly', () => {
      fixture.detectChanges();

      expect(component.shippingRates.length).toBe(SHIPPINGRATES.length);
      expect(component.shippingRates).toBe(SHIPPINGRATES);
    });

    it('should have set items$ correctly', () => {
      let items: ICartItem[];
      fixture.detectChanges();

      component.items$.subscribe((i) => (items = i));

      expect(items.length).toBe(ITEMS.length);
      expect(items).toBe(ITEMS);
    });

    it('should have set loading$ correctly to start', () => {
      let loading: boolean;
      fixture.detectChanges();

      component.loading$.subscribe((l) => (loading = l));

      expect(loading).toBeFalsy();
    });

    it('should have set quantity$ correctly', () => {
      let quantity: number;
      fixture.detectChanges();

      component.quantity$.subscribe((q) => (quantity = q));

      expect(quantity).toBe(getQuantity(ITEMS));
    });

    it('should have set errorMessage correctly', () => {
      fixture.detectChanges();

      expect(component.errorMessage).toBeUndefined();
    });

    it(`should have set pageTitle correctly`, () => {
      fixture.detectChanges();

      expect(component.pageTitle).toBe('Cart');
    });

    it(`should have retrieve called getDeliveryDate method on
      ShippingRateService with correct values`, () => {
      fixture.detectChanges();

      expect(mockShippingRateService.getDeliveryDate).toHaveBeenCalledTimes(2);
      expect(mockShippingRateService.getDeliveryDate).toHaveBeenCalledWith(
        SHIPPINGRATES[0].rate
      );
      expect(mockShippingRateService.getDeliveryDate).toHaveBeenCalledWith(
        SHIPPINGRATES[2].rate
      );
    });

    it(`should have set earliestArrival correctly`, () => {
      const date = new Date();
      mockShippingRateService.getDeliveryDate.and.returnValue(date);

      fixture.detectChanges();

      expect(component.earliestArrival).toBe(date);
    });

    it(`should have set latestArrival correctly`, () => {
      const date = new Date();
      mockShippingRateService.getDeliveryDate.and.returnValue(date);

      fixture.detectChanges();

      expect(component.latestArrival).toBe(date);
    });

    it(`should have called setShipping method on ShippingRateService with
      correct value`, () => {
      fixture.detectChanges();

      expect(mockShippingRateService.setShipping).toHaveBeenCalledTimes(1);
      expect(mockShippingRateService.setShipping).toHaveBeenCalledWith(
        SHIPPINGRATES[0].price
      );
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
      it(`should call saveItem method on CartService with correct value when item
      quantity is greater than 1`, () => {
        let item: ICartItem;
        let amount: number;
        mockCartService.saveItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        item = {
          ...ITEMS[2],
          quantity: 2,
        };
        amount = -1;
        component.saveItem(item, amount);

        const updatedItem = {
          ...item,
          quantity: item.quantity + amount,
        } as ICartItem;
        expect(mockCartService.saveItem).toHaveBeenCalledTimes(1);
        expect(mockCartService.saveItem).toHaveBeenCalledWith(updatedItem, 0);
      });

      it(`should call saveItem method on CartService with correct value when
      amount is greater than -1`, () => {
        let item: ICartItem;
        let amount: number;
        mockCartService.saveItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        item = {
          ...ITEMS[2],
          quantity: 1,
        };
        amount = 0;
        component.saveItem(item, amount);

        const updatedItem = {
          ...item,
          quantity: item.quantity + amount,
        } as ICartItem;
        expect(mockCartService.saveItem).toHaveBeenCalledTimes(1);
        expect(mockCartService.saveItem).toHaveBeenCalledWith(updatedItem, 0);
      });

      it(`should not call saveItem method on CartService when item quantity is
      less than or equal to 1 and amount equals -1`, () => {
        let item: ICartItem;
        let amount: number;
        spyOn(component, 'openRemoveModal');
        fixture.detectChanges();

        item = {
          ...ITEMS[2],
          quantity: 1,
        };
        amount = -1;
        component.saveItem(item, amount);

        expect(mockCartService.saveItem).toHaveBeenCalledTimes(0);
      });

      it(`should retrieve call getCartItems method on CartService when item
      quantity is greater than 1`, () => {
        let item: ICartItem;
        let amount: number;
        mockCartService.saveItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        item = {
          ...ITEMS[2],
          quantity: 2,
        };
        amount = -1;
        component.saveItem(item, amount);

        expect(mockCartService.getCartItems).toHaveBeenCalledTimes(1);
      });

      it(`should retrieve call getCartItems method on CartService when amount is
      greater than -1`, () => {
        let item: ICartItem;
        let amount: number;
        mockCartService.saveItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        item = {
          ...ITEMS[2],
          quantity: 1,
        };
        amount = 0;
        component.saveItem(item, amount);

        expect(mockCartService.getCartItems).toHaveBeenCalledTimes(1);
      });

      it(`should not call getCartItems method on CartService when item quantity is
      less than or equal to 1 and amount equals -1`, () => {
        let item: ICartItem;
        let amount: number;
        spyOn(component, 'openRemoveModal');
        fixture.detectChanges();

        item = {
          ...ITEMS[2],
          quantity: 1,
        };
        amount = -1;
        component.saveItem(item, amount);

        expect(mockCartService.getCartItems).toHaveBeenCalledTimes(0);
      });

      it(`should not call getCartItems method on CartService when saveItem
      method on CartService returns an error`, () => {
        let item: ICartItem;
        let amount: number;
        mockCartService.saveItem.and.returnValue(throwError(''));
        fixture.detectChanges();

        item = {
          ...ITEMS[2],
          quantity: 1,
        };
        amount = 1;
        component.saveItem(item, amount);

        expect(mockCartService.getCartItems).toHaveBeenCalledTimes(0);
      });

      it(`should call openRemoveModal method with correct value when item
      quantity is less than or equal to 1 and amount equals -1`, () => {
        let item: ICartItem;
        let amount: number;
        spyOn(component, 'openRemoveModal');
        fixture.detectChanges();

        item = {
          ...ITEMS[2],
          quantity: 1,
        };
        amount = -1;
        component.saveItem(item, amount);

        expect(component.openRemoveModal).toHaveBeenCalledTimes(1);
        expect(component.openRemoveModal).toHaveBeenCalledWith(item);
      });

      it(`should not call openRemoveModal method when item quantity is greater
      than 1`, () => {
        let item: ICartItem;
        let amount: number;
        spyOn(component, 'openRemoveModal');
        mockCartService.saveItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        item = {
          ...ITEMS[2],
          quantity: 2,
        };
        amount = -1;
        component.saveItem(item, amount);

        expect(component.openRemoveModal).toHaveBeenCalledTimes(0);
      });

      it(`should not call openRemoveModal method when amount is greater than
      -1`, () => {
        let item: ICartItem;
        let amount: number;
        spyOn(component, 'openRemoveModal');
        mockCartService.saveItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        item = {
          ...ITEMS[2],
          quantity: 1,
        };
        amount = 0;
        component.saveItem(item, amount);

        expect(component.openRemoveModal).toHaveBeenCalledTimes(0);
      });

      it(`should not call show method on NotificationService`, () => {
        let item: ICartItem;
        let amount: number;
        spyOn(component, 'openRemoveModal');
        mockCartService.saveItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        item = {
          ...ITEMS[2],
          quantity: 1,
        };
        amount = 1;
        component.saveItem(item, amount);

        expect(mockNotificationService.show).toHaveBeenCalledTimes(0);

        item = {
          ...ITEMS[2],
          quantity: 1,
        };
        amount = -1;
        component.saveItem(item, amount);

        expect(mockNotificationService.show).toHaveBeenCalledTimes(0);
      });

      it(`should call show method on NotificationService when saveItem method on
      CartService returns an error`, () => {
        let item: ICartItem;
        let amount: number;
        mockCartService.saveItem.and.returnValue(throwError(''));
        fixture.detectChanges();

        item = {
          ...ITEMS[2],
          quantity: 1,
        };
        amount = 1;
        component.saveItem(item, amount);

        expect(mockNotificationService.show).toHaveBeenCalledTimes(1);
      });

      it(`should call show method on NotificationService when getCartItems method
      on CartService returns an error`, () => {
        let item: ICartItem;
        let amount: number;
        mockCartService.saveItem.and.returnValue(of(ITEMS[2]));
        mockCartService.getCartItems.and.returnValue(throwError(''));
        fixture.detectChanges();

        item = {
          ...ITEMS[2],
          quantity: 1,
        };
        amount = 1;
        component.saveItem(item, amount);

        expect(mockNotificationService.show).toHaveBeenCalledTimes(1);
      });
    });

    describe('openRemoveModal', () => {
      it(`should call open method on ModalService with correct
      value`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.removeItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.openRemoveModal(ITEMS[0]);

        expect(mockNgbModal.open).toHaveBeenCalledTimes(1);
        expect(mockNgbModal.open).toHaveBeenCalledWith(ConfirmModalComponent);
      });

      it(`should call removeItem method on CartService with correct
      value`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.removeItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.openRemoveModal(ITEMS[0]);

        expect(mockCartService.removeItem).toHaveBeenCalledTimes(1);
        expect(mockCartService.removeItem).toHaveBeenCalledWith(ITEMS[0]);
      });

      it(`should not call removeItem method on CartService when open method on
      ModalService returns mockErrorModalRef`, () => {
        mockNgbModal.open.and.returnValue(mockErrorModalRef);
        fixture.detectChanges();

        component.openRemoveModal(ITEMS[0]);

        expect(mockCartService.removeItem).toHaveBeenCalledTimes(0);
      });

      it(`should retrieve call getCartItems method on CartService`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.removeItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.openRemoveModal(ITEMS[0]);

        expect(mockCartService.getCartItems).toHaveBeenCalledTimes(1);
      });

      it(`should not call getCartItems method on CartService when open method on
      ModalService returns mockErrorModalRef`, () => {
        mockNgbModal.open.and.returnValue(mockErrorModalRef);
        fixture.detectChanges();

        component.openRemoveModal(ITEMS[0]);

        expect(mockCartService.getCartItems).toHaveBeenCalledTimes(0);
      });

      it(`should not call show method on NotificationService`, () => {
        mockCartService.removeItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        mockNgbModal.open.and.returnValue(mockModalRef);
        fixture.detectChanges();

        component.openRemoveModal(ITEMS[2]);

        expect(mockNotificationService.show).toHaveBeenCalledTimes(0);
      });

      it(`should call show method on NotificationService when removeItem method on
      CartService returns an error`, () => {
        mockCartService.removeItem.and.returnValue(throwError(''));
        mockNgbModal.open.and.returnValue(mockModalRef);
        fixture.detectChanges();

        component.openRemoveModal(ITEMS[2]);

        expect(mockNotificationService.show).toHaveBeenCalled();
      });

      it('should set componentInstance properties on mockModalRef', () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.removeItem.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.openRemoveModal(ITEMS[0]);

        expect(mockModalRef.componentInstance.title).toBe('Remove Item');
        expect(mockModalRef.componentInstance.message).toBe(
          `Are you sure you want to remove "${ITEMS[0].name}"?`
        );
        expect(mockModalRef.componentInstance.warningMessage).toBe(
          'This operation can not be undone.'
        );
        expect(mockModalRef.componentInstance.infoMessage).toBeUndefined();
        expect(mockModalRef.componentInstance.type).toBe('bg-danger');
        expect(mockModalRef.componentInstance.closeMessage).toBe('remove');
        expect(mockModalRef.componentInstance.dismissMessage).toBeUndefined();
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

        expect(mockNgbModal.open).toHaveBeenCalledTimes(1);
        expect(mockNgbModal.open).toHaveBeenCalledWith(ConfirmModalComponent);
      });

      it(`should call removeAllItems method on CartService with correct
      value`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.removeAllItems.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.openRemoveAllModal(ITEMS);

        expect(mockCartService.removeAllItems).toHaveBeenCalledTimes(1);
        expect(mockCartService.removeAllItems).toHaveBeenCalledWith(ITEMS);
      });

      it(`should not call removeAllItems method on CartService when open method
      on ModalService returns mockErrorModalRef`, () => {
        mockNgbModal.open.and.returnValue(mockErrorModalRef);
        fixture.detectChanges();

        component.openRemoveModal(ITEMS[0]);

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

        component.openRemoveModal(ITEMS[0]);

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

      it(`should call show method on NotificationService when removeAllItems
      method on CartService returns an error`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.getCartItems.and.returnValue(of(true));
        mockCartService.removeAllItems.and.returnValue(throwError(''));
        fixture.detectChanges();

        component.openRemoveAllModal(ITEMS);

        expect(mockNotificationService.show).toHaveBeenCalledTimes(1);
      });

      it(`should call show method on NotificationService when getCartItems
      method on CartService returns an error`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.removeAllItems.and.returnValue(of(true));
        mockCartService.getCartItems.and.returnValue(throwError(''));
        fixture.detectChanges();

        component.openRemoveAllModal(ITEMS);

        expect(mockNotificationService.show).toHaveBeenCalledTimes(1);
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
    let ITEMS: ICartItem[];
    let RESOLVEDDATA: ShippingRatesResult;
    let mockTitle: Title;

    const SHIPPINGRATES = null;
    const ERRORMESSAGE = 'Error!';

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
                body:
                  'Powerful eight-core, sixteen-way processing performance.',
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
        ];
        mockCartService = jasmine.createSpyObj([], {
          cartItems$: of(ITEMS),
          cartQuantity$: of(getQuantity(ITEMS)),
        });
        mockShippingRateService = jasmine.createSpyObj([
          'setShipping',
          'getDeliveryDate',
        ]);
        RESOLVEDDATA = {
          shippingRates: SHIPPINGRATES,
          error: ERRORMESSAGE,
        };
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

          declarations: [CartComponent, FakeCartSummaryComponent],

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

    it('should have set shippingRates correctly', () => {
      fixture.detectChanges();

      expect(component.shippingRates).toBeNull();
    });

    it('should have set items$ correctly', () => {
      let items: ICartItem[];
      fixture.detectChanges();

      component.items$.subscribe((i) => (items = i));

      expect(items.length).toBe(ITEMS.length);
      expect(items).toBe(ITEMS);
    });

    it('should have set errorMessage correctly', () => {
      fixture.detectChanges();

      expect(component.errorMessage).toBe(ERRORMESSAGE);
    });

    it('should have set earliestArrival correctly', () => {
      fixture.detectChanges();

      expect(component.earliestArrival).toBeUndefined();
    });

    it('should have set latestArrival correctly', () => {
      fixture.detectChanges();

      expect(component.latestArrival).toBeUndefined();
    });

    it('should have set pageTitle correctly', () => {
      fixture.detectChanges();

      expect(component.pageTitle).toBe('Retrieval Error');
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

    it(`should have not retrieve called getDeliveryDate method on
      ShippingRateService`, () => {
      fixture.detectChanges();

      expect(mockShippingRateService.getDeliveryDate).toHaveBeenCalledTimes(0);
    });

    it(`should have not retrieve called setShipping method on
      ShippingRateService`, () => {
      fixture.detectChanges();

      expect(mockShippingRateService.setShipping).toHaveBeenCalledTimes(0);
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
    let ITEMS: ICartItem[];
    let RESOLVEDDATA: ShippingRatesResult;

    const SHIPPINGRATES: IShipping[] = [
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
                body:
                  'Powerful eight-core, sixteen-way processing performance.',
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
        RESOLVEDDATA = {
          shippingRates: SHIPPINGRATES,
        };
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
        mockShippingRateService = jasmine.createSpyObj([
          'setShipping',
          'getDeliveryDate',
        ]);
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],

          declarations: [CartComponent, CartSummaryComponent],

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
      // run ngOnInit
      fixture.detectChanges();

      const elements = fixture.debugElement.queryAll(By.css('h4 span'));
      expect(elements[0].nativeElement.textContent).toBe(component.pageTitle);
    });

    it('should not set errorMessage in the template', () => {
      // run ngOnInit
      fixture.detectChanges();

      const elements = fixture.debugElement.queryAll(By.css('ngb-alert span'));
      expect(elements.length).toBe(0);
    });

    it('should set items$ in the template', () => {
      // run ngOnInit
      fixture.detectChanges();

      // item debug elements
      const tabelRowElements = fixture.debugElement.queryAll(
        By.css('tbody tr')
      );
      expect(tabelRowElements.length).toEqual(ITEMS.length);
      for (let i = 0; i < tabelRowElements.length; i++) {
        let element: DebugElement;
        const tableCellElements = tabelRowElements[i].queryAll(By.css('td'));

        element = tableCellElements[0].query(By.css('img'));
        expect(element.nativeElement.src).toContain(ITEMS[i].imageUrl);

        element = tableCellElements[1].query(By.css('a'));
        expect(element.nativeElement.textContent).toBe(ITEMS[i].name);

        element = tableCellElements[2].query(By.css('span'));
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

    it('should set earliestArrival and latestArrival in the template', () => {
      let date: string;
      mockShippingRateService.getDeliveryDate.and.returnValue(new Date());

      fixture.detectChanges();

      const elements = fixture.debugElement.queryAll(
        By.css('#expectedArrival')
      );
      expect(elements.length).toBe(1);
      date = formatDate(component.earliestArrival, 'longDate', 'en-US');
      expect(elements[0].nativeElement.textContent).toContain(date);
      date = formatDate(component.earliestArrival, 'longDate', 'en-US');
      expect(elements[0].nativeElement.textContent).toContain(date);
    });

    it(`should call openRemoveModal method with correct value when remove input
      button is clicked`, () => {
      // Arrange
      spyOn(component, 'openRemoveModal');
      fixture.detectChanges();
      const input = fixture.debugElement.queryAll(By.css('td input'))[3];

      // Act
      input.triggerEventHandler('click', null);

      // Assert
      expect(component.openRemoveModal).toHaveBeenCalledTimes(1);
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
      expect(component.openRemoveAllModal).toHaveBeenCalledTimes(1);
      expect(component.openRemoveAllModal).toHaveBeenCalledWith(ITEMS);
    });

    it(`should call saveItem method with correct value when decrease input button
      is clicked`, () => {
      // Arrange
      spyOn(component, 'saveItem');
      fixture.detectChanges();
      const input = fixture.debugElement.queryAll(
        By.css('tbody tr td input')
      )[0];

      // Act
      input.triggerEventHandler('click', null);

      // Assert
      expect(component.saveItem).toHaveBeenCalledTimes(1);
      expect(component.saveItem).toHaveBeenCalledWith(ITEMS[0], -1);
    });

    it(`should call saveItem method with correct value when increase input button
      is clicked`, () => {
      // Arrange
      spyOn(component, 'saveItem');
      fixture.detectChanges();
      const input = fixture.debugElement.queryAll(
        By.css('tbody tr td input')
      )[2];

      // Act
      input.triggerEventHandler('click', null);

      // Assert
      expect(component.saveItem).toHaveBeenCalledTimes(1);
      expect(component.saveItem).toHaveBeenCalledWith(ITEMS[0], 1);
    });
  });

  describe('w/o SHIPPINGRATES', () => {
    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let mockCartService;
    let mockActivatedRoute;
    let ITEMS: ICartItem[];
    let RESOLVEDDATA: ShippingRatesResult;

    const SHIPPINGRATES = null;
    const ERRORMESSAGE = 'Error!';

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
                body:
                  'Powerful eight-core, sixteen-way processing performance.',
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
        mockCartService = jasmine.createSpyObj(
          ['saveItem', 'removeItem', 'removeAllItems', 'getCartItems'],
          { cartItems$: of(ITEMS), cartQuantity$: of(getQuantity(ITEMS)) }
        );
        RESOLVEDDATA = {
          shippingRates: SHIPPINGRATES,
          error: ERRORMESSAGE,
        };
        mockActivatedRoute = jasmine.createSpyObj([], {
          snapshot: {
            data: {
              resolvedData: RESOLVEDDATA,
            },
          },
        });

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

      const elements = fixture.debugElement.queryAll(By.css('h1 span'));
      expect(elements.length).toBe(1);
      expect(elements[0].nativeElement.textContent).toBe(component.pageTitle);
    });

    it('should set errorMessage in the template', () => {
      // run ngOnInit
      fixture.detectChanges();

      const elements = fixture.debugElement.queryAll(By.css('ngb-alert span'));
      expect(elements.length).toBe(1);
      expect(elements[0].nativeElement.textContent).toBe(
        component.errorMessage
      );
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

    it('should not set quantity$ in the template', () => {
      // run ngOnInit
      fixture.detectChanges();

      const elements = fixture.debugElement.queryAll(By.css('h4 span'));
      expect(elements.length).toBe(0);
    });

    it(`should not set earliestArrival or latestArrival in the
      template`, () => {
      fixture.detectChanges();

      const elements = fixture.debugElement.queryAll(
        By.css('#expectedArrival')
      );
      expect(elements.length).toBe(0);
    });
  });
});
