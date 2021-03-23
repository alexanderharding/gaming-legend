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
import { CartService } from '../core/cart.service';
import { Observable, of, throwError } from 'rxjs';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { ShippingRateService } from './shipping-rate.service';
import { ICartItem } from '../types/cart-item';
import { IShipping } from '../types/shipping';

import { By, Title } from '@angular/platform-browser';
import { CartSummaryComponent } from './cart-summary/cart-summary.component';
import { ErrorReceivedComponent } from '../shared/error-received/error-received.component';

import {
  NgbModal,
  NgbModalConfig,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ShippingRatesResult } from '../types/shipping-rates-result';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';
import { NotificationService } from '../core/notification.service';
import { formatCurrency } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { INotification } from 'src/app/types/notification';

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
    selector: 'cart-cart-summary',
    template: '<div></div>',
  })
  class FakeCartSummaryComponent {
    @Input() shippingRates: IShipping[];
  }

  @Component({
    selector: 'ctacu-error-received',
    template: '<div></div>',
  })
  class FakeErrorReceivedComponent {
    @Input() errorMessage: string;
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
    const QUANTITYOPTIONS: number[] = [0, 1, 2, 3, 4, 5];

    beforeEach(
      waitForAsync(() => {
        mockCartService = jasmine.createSpyObj(
          ['saveItem', 'deleteItem', 'deleteAllItems'],
          {
            cartItems$: of(ITEMS),
            cartQuantity$: of(getQuantity(ITEMS)),
            quantityOptions: QUANTITYOPTIONS,
          }
        );
        mockShippingRateService = jasmine.createSpyObj(['getDeliveryDate']);
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
            ReactiveFormsModule,
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

    it('should have set cartForm correctly', () => {
      let items: ICartItem[];
      fixture.detectChanges();
      component.items$.subscribe((i) => (items = i));

      const quantitiesArray = component.cartForm.get('quantities') as FormArray;
      expect(quantitiesArray.length).toBe(items.length);
      for (let i = 0; i < quantitiesArray.length; i++) {
        const control = quantitiesArray.controls[i] as AbstractControl;
        expect(control.value).toEqual({
          itemId: +items[i].id,
          quantity: +items[i].quantity,
        });
      }
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

    it('should have set quantityOptions correctly', () => {
      fixture.detectChanges();

      expect(component.quantityOptions).toEqual(QUANTITYOPTIONS);
    });

    it('should have set quantities$ correctly', () => {
      let formArray: FormArray;
      fixture.detectChanges();

      component.quantities$.subscribe((value) => (formArray = value));

      const quantitiesArray = component.cartForm.get('quantities') as FormArray;
      expect(formArray).toEqual(quantitiesArray);
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

    describe('cartForm', () => {
      describe('quantities controls', () => {
        it(`should call saveItem method on CartService with correct value when
          control value.quantity is greater than 0`, () => {
          mockCartService.saveItem.and.returnValue(of(true));
          fixture.detectChanges();
          const quantitiesArray = component.cartForm.get(
            'quantities'
          ) as FormArray;

          for (let i = 0; i < quantitiesArray.controls.length; i++) {
            const control: AbstractControl = quantitiesArray.controls[i];
            control.patchValue({
              quantity: +control.get('quantity').value + 1,
            });
            const item = {
              ...ITEMS[i],
              quantity: +control.get('quantity').value,
            } as ICartItem;
            expect(mockCartService.saveItem).toHaveBeenCalledWith(item, i);
          }

          expect(mockCartService.saveItem).toHaveBeenCalledTimes(
            quantitiesArray.length
          );
        });

        it(`should set loading$ correctly when control value.quantity is greater
          than 0`, () => {
          const loading: boolean[] = [];
          mockCartService.saveItem.and.returnValue(of(true));
          fixture.detectChanges();
          const quantitiesArray = component.cartForm.get(
            'quantities'
          ) as FormArray;
          const control: AbstractControl = quantitiesArray.controls[1];

          component.loading$.subscribe((v) => loading.push(v));
          control.patchValue({
            quantity: +control.get('quantity').value + 1,
          });

          expect(loading.length).toBe(3);
          for (let i = 0; i < loading.length; i++) {
            const value = loading[i];
            if (i % 2 === 0) {
              expect(value).toBeFalse();
            } else {
              expect(value).toBeTrue();
            }
          }
        });

        it(`should call disable method on cartForm with correct value when
         control value.quantity is greater than 0`, () => {
          mockCartService.saveItem.and.returnValue(of(true));
          fixture.detectChanges();
          const form: FormGroup = component.cartForm;
          spyOn(form, 'disable');
          spyOn(form, 'enable');
          const quantitiesArray = form.get('quantities') as FormArray;
          const control: AbstractControl = quantitiesArray.controls[1];

          control.patchValue({
            quantity: +control.get('quantity').value + 1,
          });

          expect(form.disable).toHaveBeenCalledOnceWith({
            emitEvent: false,
          });
          expect(form.disable).toHaveBeenCalledBefore(form.enable);
        });

        it(`should call enable method on cartForm with correct value when
         control value.quantity is greater than 0`, () => {
          mockCartService.saveItem.and.returnValue(of(true));
          fixture.detectChanges();
          const form: FormGroup = component.cartForm;
          spyOn(form, 'disable');
          spyOn(form, 'enable');
          const quantitiesArray = form.get('quantities') as FormArray;
          const control: AbstractControl = quantitiesArray.controls[1];

          control.patchValue({
            quantity: +control.get('quantity').value + 1,
          });

          expect(form.enable).toHaveBeenCalledOnceWith({
            emitEvent: false,
          });
        });

        it(`should call show method on NotificationService with correct value
          when saveItem method on CartService returns an error`, () => {
          mockCartService.saveItem.and.returnValue(throwError(''));
          fixture.detectChanges();
          const quantitiesArray = component.cartForm.get(
            'quantities'
          ) as FormArray;
          const controls: AbstractControl[] = quantitiesArray.controls;

          for (let i = 0; i < controls.length; i++) {
            const control: AbstractControl = controls[i];
            control.patchValue({
              quantity: +control.get('quantity').value + 1,
            });
            const notification: INotification = {
              textOrTpl: `Error updating ${ITEMS[i].name} !`,
              className: 'bg-danger text-light',
              delay: 15000,
            };
            expect(mockNotificationService.show).toHaveBeenCalledWith(
              notification
            );
          }

          expect(mockNotificationService.show).toHaveBeenCalledTimes(
            controls.length
          );
        });

        it(`should set loading$ correctly when saveItem method on CartService
         returns an error`, () => {
          const loading: boolean[] = [];
          mockCartService.saveItem.and.returnValue(throwError(''));
          fixture.detectChanges();
          const quantitiesArray = component.cartForm.get(
            'quantities'
          ) as FormArray;
          const control: AbstractControl = quantitiesArray.controls[1];

          component.loading$.subscribe((v) => loading.push(v));
          control.patchValue({
            quantity: +control.get('quantity').value + 1,
          });

          expect(loading.length).toBe(3);
          for (let i = 0; i < loading.length; i++) {
            const value = loading[i];
            if (i % 2 === 0) {
              expect(value).toBeFalse();
            } else {
              expect(value).toBeTrue();
            }
          }
        });

        it(`should call disable method on cartForm with correct value when
          saveItem method on CartService returns an error`, () => {
          mockCartService.saveItem.and.returnValue(throwError(''));
          fixture.detectChanges();
          const form: FormGroup = component.cartForm;
          spyOn(form, 'disable');
          spyOn(form, 'enable');
          const quantitiesArray = form.get('quantities') as FormArray;
          const control: AbstractControl = quantitiesArray.controls[1];

          control.patchValue({
            quantity: +control.get('quantity').value + 1,
          });

          expect(form.disable).toHaveBeenCalledOnceWith({
            emitEvent: false,
          });
          expect(form.disable).toHaveBeenCalledBefore(form.enable);
        });

        it(`should call enable method on cartForm with correct value when
          saveItem method on CartService returns an error`, () => {
          mockCartService.saveItem.and.returnValue(throwError(''));
          fixture.detectChanges();
          const form: FormGroup = component.cartForm;
          spyOn(form, 'disable');
          spyOn(form, 'enable');
          const quantitiesArray = form.get('quantities') as FormArray;
          const control: AbstractControl = quantitiesArray.controls[1];

          control.patchValue({
            quantity: +control.get('quantity').value + 1,
          });

          expect(form.enable).toHaveBeenCalledOnceWith({
            emitEvent: false,
          });
        });

        it(`should call show method on NotificationService with correct value
          when deleteItem method on CartService returns an error`, () => {
          mockCartService.deleteItem.and.returnValue(throwError(''));
          fixture.detectChanges();
          const quantitiesArray = component.cartForm.get(
            'quantities'
          ) as FormArray;
          const controls: AbstractControl[] = quantitiesArray.controls;

          for (let i = 0; i < controls.length; i++) {
            const control: AbstractControl = controls[i];
            control.patchValue({
              quantity: 0,
            });
            const notification: INotification = {
              textOrTpl: `Error removing ${ITEMS[i].name} !`,
              className: 'bg-danger text-light',
              delay: 15000,
            };
            expect(mockNotificationService.show).toHaveBeenCalledWith(
              notification
            );
          }

          expect(mockNotificationService.show).toHaveBeenCalledTimes(
            controls.length
          );
        });

        it(`should set loading$ correctly when deleteItem method on CartService
          returns an error`, () => {
          const loading: boolean[] = [];
          mockCartService.deleteItem.and.returnValue(throwError(''));
          fixture.detectChanges();
          const quantitiesArray = component.cartForm.get(
            'quantities'
          ) as FormArray;
          const control: AbstractControl = quantitiesArray.controls[1];

          component.loading$.subscribe((v) => loading.push(v));
          control.patchValue({
            quantity: 0,
          });

          expect(loading.length).toBe(3);
          for (let i = 0; i < loading.length; i++) {
            const value = loading[i];
            if (i % 2 === 0) {
              expect(value).toBeFalse();
            } else {
              expect(value).toBeTrue();
            }
          }
        });

        it(`should call disable method on cartForm with correct value when
          deleteItem method on CartService returns an error`, () => {
          mockCartService.deleteItem.and.returnValue(throwError(''));
          fixture.detectChanges();
          const form: FormGroup = component.cartForm;
          spyOn(form, 'disable');
          spyOn(form, 'enable');
          const quantitiesArray = form.get('quantities') as FormArray;

          quantitiesArray.controls[1].patchValue({
            quantity: 0,
          });

          expect(form.disable).toHaveBeenCalledOnceWith({
            emitEvent: false,
          });
          expect(form.disable).toHaveBeenCalledBefore(form.enable);
        });

        it(`should call enable method on cartForm with correct value when
          deleteItem method on CartService returns an error`, () => {
          mockCartService.deleteItem.and.returnValue(throwError(''));
          fixture.detectChanges();
          const form: FormGroup = component.cartForm;
          spyOn(form, 'disable');
          spyOn(form, 'enable');
          const quantitiesArray = form.get('quantities') as FormArray;

          quantitiesArray.controls[1].patchValue({
            quantity: 0,
          });

          expect(form.enable).toHaveBeenCalledOnceWith({
            emitEvent: false,
          });
        });

        it(`should call deleteItem method on CartService with correct value when
          control value.quantity is less than or equal to 0`, () => {
          const index = 0;
          mockCartService.deleteItem.and.returnValue(of(true));
          fixture.detectChanges();
          const quantitiesArray = component.cartForm.get(
            'quantities'
          ) as FormArray;
          const control = quantitiesArray.controls[index];

          control.patchValue({
            quantity: 0,
          });

          const item = {
            ...ITEMS[index],
            quantity: +control.get('quantity').value,
          } as ICartItem;
          expect(mockCartService.deleteItem).toHaveBeenCalledOnceWith(item);
        });

        it(`should set loading$ correctly when control value.quantity is less
          than or equal to 0`, () => {
          const loading: boolean[] = [];
          mockCartService.deleteItem.and.returnValue(of(true));
          fixture.detectChanges();
          const quantitiesArray = component.cartForm.get(
            'quantities'
          ) as FormArray;
          const control: AbstractControl = quantitiesArray.controls[1];

          component.loading$.subscribe((v) => loading.push(v));
          control.patchValue({
            quantity: 0,
          });

          expect(loading.length).toBe(3);
          for (let i = 0; i < loading.length; i++) {
            const value = loading[i];
            if (i % 2 === 0) {
              expect(value).toBeFalse();
            } else {
              expect(value).toBeTrue();
            }
          }
        });

        it(`should call disable method on cartForm with correct value when
          control value.quantity is less than or equal to 0`, () => {
          mockCartService.deleteItem.and.returnValue(of(true));
          fixture.detectChanges();
          const form: FormGroup = component.cartForm;
          spyOn(form, 'disable');
          spyOn(form, 'enable');
          const quantitiesArray = form.get('quantities') as FormArray;

          quantitiesArray.controls[1].patchValue({
            quantity: 0,
          });

          expect(form.disable).toHaveBeenCalledOnceWith({
            emitEvent: false,
          });
          expect(form.disable).toHaveBeenCalledBefore(form.enable);
        });

        it(`should call enable method on cartForm with correct value when
          control value.quantity is less than or equal to 0`, () => {
          mockCartService.deleteItem.and.returnValue(of(true));
          fixture.detectChanges();
          const form: FormGroup = component.cartForm;
          spyOn(form, 'disable');
          spyOn(form, 'enable');
          const quantitiesArray = form.get('quantities') as FormArray;

          quantitiesArray.controls[1].patchValue({
            quantity: 0,
          });

          expect(form.enable).toHaveBeenCalledOnceWith({
            emitEvent: false,
          });
        });

        it(`should not call saveItem method on CartService when control
          value.quantity less than or equal to 0`, () => {
          mockCartService.deleteItem.and.returnValue(of(true));
          fixture.detectChanges();
          const quantitiesArray = component.cartForm.get(
            'quantities'
          ) as FormArray;

          for (let i = 0; i < quantitiesArray.length; i++) {
            const control: AbstractControl = quantitiesArray.controls[0];
            control.patchValue({
              quantity: 0,
            });
          }

          expect(mockCartService.saveItem).toHaveBeenCalledTimes(0);
        });

        it(`should not call show method on NotificationService when control
          value.quantity is greater than 0`, () => {
          mockCartService.saveItem.and.returnValue(of(true));
          fixture.detectChanges();
          const quantitiesArray = component.cartForm.get(
            'quantities'
          ) as FormArray;
          const controls: AbstractControl[] = quantitiesArray.controls;

          for (let i = 0; i < controls.length; i++) {
            const control: AbstractControl = controls[i];
            control.patchValue({
              quantity: +control.get('quantity').value + 1,
            });
          }

          expect(mockNotificationService.show).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('openDeleteModal', () => {
      it(`should call open method on ModalService with correct
       value`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteItem.and.returnValue(of(true));
        fixture.detectChanges();

        component.openDeleteModal(ITEMS[0], ITEMS);

        expect(mockNgbModal.open).toHaveBeenCalledOnceWith(
          ConfirmModalComponent
        );
      });

      it(`should call deleteItem method on CartService with correct
        value`, () => {
        const index = 0;
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteItem.and.returnValue(of(true));
        fixture.detectChanges();

        component.openDeleteModal(ITEMS[index], ITEMS);

        expect(mockCartService.deleteItem).toHaveBeenCalledOnceWith(
          ITEMS[index]
        );
      });

      it(`should set loading$ correctly`, () => {
        const loading: boolean[] = [];
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteItem.and.returnValue(of(true));
        fixture.detectChanges();

        component.loading$.subscribe((v) => loading.push(v));
        component.openDeleteModal(ITEMS[0], ITEMS);

        expect(loading.length).toBe(3);
        for (let i = 0; i < loading.length; i++) {
          const value = loading[i];
          if (i % 2 === 0) {
            expect(value).toBeFalse();
          } else {
            expect(value).toBeTrue();
          }
        }
      });

      it(`should call disable method on cartForm with correct value`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteItem.and.returnValue(of(true));
        fixture.detectChanges();
        const form: FormGroup = component.cartForm;
        spyOn(form, 'disable');
        spyOn(form, 'enable');

        component.openDeleteModal(ITEMS[0], ITEMS);

        expect(form.disable).toHaveBeenCalledOnceWith({
          emitEvent: false,
        });
        expect(form.disable).toHaveBeenCalledBefore(form.enable);
      });

      it(`should call enable method on cartForm with correct value`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteItem.and.returnValue(of(true));
        fixture.detectChanges();
        const form: FormGroup = component.cartForm;
        spyOn(form, 'disable');
        spyOn(form, 'enable');

        component.openDeleteModal(ITEMS[0], ITEMS);

        expect(form.enable).toHaveBeenCalledOnceWith({
          emitEvent: false,
        });
      });

      it(`should call show method on NotificationService with correct value when
        deleteItem method on CartService returns an error`, () => {
        const index = 0;
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteItem.and.returnValue(throwError(''));
        fixture.detectChanges();

        component.openDeleteModal(ITEMS[index], ITEMS);

        expect(mockNotificationService.show).toHaveBeenCalledOnceWith({
          textOrTpl: `Error removing ${ITEMS[index].name} !`,
          className: 'bg-danger text-light',
          delay: 15000,
        });
      });

      it(`should set loading$ correctly when deleteItem method on CartService
        returns an error`, () => {
        const loading: boolean[] = [];
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteItem.and.returnValue(throwError(''));
        fixture.detectChanges();

        component.loading$.subscribe((v) => loading.push(v));
        component.openDeleteModal(ITEMS[0], ITEMS);

        expect(loading.length).toBe(3);
        for (let i = 0; i < loading.length; i++) {
          const value = loading[i];
          if (i % 2 === 0) {
            expect(value).toBeFalse();
          } else {
            expect(value).toBeTrue();
          }
        }
      });

      it(`should call disable method on cartForm with correct value when
        deleteItem method on CartService  returns an error`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteItem.and.returnValue(throwError(''));
        fixture.detectChanges();
        const form: FormGroup = component.cartForm;
        spyOn(form, 'disable');
        spyOn(form, 'enable');

        component.openDeleteModal(ITEMS[0], ITEMS);

        expect(form.disable).toHaveBeenCalledOnceWith({
          emitEvent: false,
        });
        expect(form.disable).toHaveBeenCalledBefore(form.enable);
      });

      it(`should call enable method on cartForm with correct value when
        deleteItem method on CartService  returns an error`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteItem.and.returnValue(throwError(''));
        fixture.detectChanges();
        const form: FormGroup = component.cartForm;
        spyOn(form, 'disable');
        spyOn(form, 'enable');

        component.openDeleteModal(ITEMS[0], ITEMS);

        expect(form.enable).toHaveBeenCalledOnceWith({
          emitEvent: false,
        });
      });

      it('should set componentInstance properties on mockModalRef', () => {
        const index = 0;
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteItem.and.returnValue(of(true));
        fixture.detectChanges();

        component.openDeleteModal(ITEMS[index], ITEMS);

        expect(mockModalRef.componentInstance.message).toBe(
          `Are you sure you want remove "${ITEMS[index].name}" from the cart?`
        );
        expect(mockModalRef.componentInstance.closeMessage).toBe('Remove');
      });

      it(`should not call deleteItem method on CartService when open method
        on ModalService returns mockErrorModalRef`, () => {
        mockNgbModal.open.and.returnValue(mockErrorModalRef);
        fixture.detectChanges();

        component.openDeleteModal(ITEMS[0], ITEMS);

        expect(mockCartService.deleteItem).toHaveBeenCalledTimes(0);
      });

      it(`should set loading$ correctly when open method on ModalService
        returns mockErrorModalRef`, () => {
        const loading: boolean[] = [];
        mockNgbModal.open.and.returnValue(mockErrorModalRef);
        fixture.detectChanges();

        component.loading$.subscribe((v) => loading.push(v));
        component.openDeleteModal(ITEMS[0], ITEMS);

        expect(loading.length).toBe(1);
        for (let i = 0; i < loading.length; i++) {
          const value = loading[i];
          if (i % 2 === 0) {
            expect(value).toBeFalse();
          } else {
            expect(value).toBeTrue();
          }
        }
      });

      it(`should not call disable method on cartForm when open method on
        ModalService returns mockErrorModalRef`, () => {
        mockNgbModal.open.and.returnValue(mockErrorModalRef);
        fixture.detectChanges();
        const form: FormGroup = component.cartForm;
        spyOn(form, 'disable');
        spyOn(form, 'enable');

        component.openDeleteModal(ITEMS[0], ITEMS);

        expect(form.disable).toHaveBeenCalledTimes(0);
      });

      it(`should not call enable method on cartForm when open method on
        ModalService returns mockErrorModalRef`, () => {
        mockNgbModal.open.and.returnValue(mockErrorModalRef);
        fixture.detectChanges();
        const form: FormGroup = component.cartForm;
        spyOn(form, 'disable');
        spyOn(form, 'enable');

        component.openDeleteModal(ITEMS[0], ITEMS);

        expect(form.enable).toHaveBeenCalledTimes(0);
      });

      it(`should not call show method on NotificationService`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteItem.and.returnValue(of(true));
        fixture.detectChanges();

        component.openDeleteModal(ITEMS[0], ITEMS);

        expect(mockNotificationService.show).toHaveBeenCalledTimes(0);
      });
    });

    describe('openDeleteAllModal', () => {
      it(`should call open method on ModalService with correct
       value`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteAllItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.openDeleteAllModal(ITEMS);

        expect(mockNgbModal.open).toHaveBeenCalledOnceWith(
          ConfirmModalComponent
        );
      });

      it(`should call deleteAllItems method on CartService with correct
        value`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteAllItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.openDeleteAllModal(ITEMS);

        expect(mockCartService.deleteAllItems).toHaveBeenCalledOnceWith(ITEMS);
      });

      it(`should set loading$ correctly`, () => {
        const loading: boolean[] = [];
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteAllItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.loading$.subscribe((v) => loading.push(v));
        component.openDeleteAllModal(ITEMS);

        expect(loading.length).toBe(3);
        for (let i = 0; i < loading.length; i++) {
          const value = loading[i];
          if (i % 2 === 0) {
            expect(value).toBeFalse();
          } else {
            expect(value).toBeTrue();
          }
        }
      });

      it(`should call disable method on cartForm with correct value`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteAllItems.and.returnValue(of(true));
        fixture.detectChanges();
        const form: FormGroup = component.cartForm;
        spyOn(form, 'disable');
        spyOn(form, 'enable');

        component.openDeleteAllModal(ITEMS);

        expect(form.disable).toHaveBeenCalledOnceWith({
          emitEvent: false,
        });
        expect(form.disable).toHaveBeenCalledBefore(form.enable);
      });

      it(`should call enable method on cartForm with correct value`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteAllItems.and.returnValue(of(true));
        fixture.detectChanges();
        const form: FormGroup = component.cartForm;
        spyOn(form, 'disable');
        spyOn(form, 'enable');

        component.openDeleteAllModal(ITEMS);

        expect(form.enable).toHaveBeenCalledOnceWith({
          emitEvent: false,
        });
      });

      it(`should not call deleteAllItems method on CartService when open method
        on ModalService returns mockErrorModalRef`, () => {
        mockNgbModal.open.and.returnValue(mockErrorModalRef);
        fixture.detectChanges();

        component.openDeleteAllModal(ITEMS);

        expect(mockCartService.deleteAllItems).toHaveBeenCalledTimes(0);
      });

      it(`should set loading$ correctly when open method on ModalService
        returns mockErrorModalRef`, () => {
        const loading: boolean[] = [];
        mockNgbModal.open.and.returnValue(mockErrorModalRef);
        fixture.detectChanges();

        component.loading$.subscribe((v) => loading.push(v));
        component.openDeleteAllModal(ITEMS);

        expect(loading.length).toBe(1);
        for (let i = 0; i < loading.length; i++) {
          const value = loading[i];
          if (i % 2 === 0) {
            expect(value).toBeFalse();
          } else {
            expect(value).toBeTrue();
          }
        }
      });

      it(`should not call disable method on cartForm when open method on
        ModalService returns mockErrorModalRef`, () => {
        mockNgbModal.open.and.returnValue(mockErrorModalRef);
        fixture.detectChanges();
        const form: FormGroup = component.cartForm;
        spyOn(form, 'disable');
        spyOn(form, 'enable');

        component.openDeleteAllModal(ITEMS);

        expect(form.disable).toHaveBeenCalledTimes(0);
      });

      it(`should not call enable method on cartForm when open method on
        ModalService returns mockErrorModalRef`, () => {
        mockNgbModal.open.and.returnValue(mockErrorModalRef);
        fixture.detectChanges();
        const form: FormGroup = component.cartForm;
        spyOn(form, 'disable');
        spyOn(form, 'enable');

        component.openDeleteAllModal(ITEMS);

        expect(form.enable).toHaveBeenCalledTimes(0);
      });

      it(`should not call show method on NotificationService`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteAllItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.openDeleteAllModal(ITEMS);

        expect(mockNotificationService.show).toHaveBeenCalledTimes(0);
      });

      it(`should call show method on NotificationService with correct value when
        deleteAllItems method on CartService returns an error`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteAllItems.and.returnValue(throwError(''));
        fixture.detectChanges();

        component.openDeleteAllModal(ITEMS);

        expect(mockNotificationService.show).toHaveBeenCalledOnceWith({
          textOrTpl: 'Error emptying cart !',
          className: 'bg-danger text-light',
          delay: 15000,
        });
      });

      it(`should set loading$ correctly when deleteAllItems method on
        CartService returns an error`, () => {
        const loading: boolean[] = [];
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteAllItems.and.returnValue(throwError(''));
        fixture.detectChanges();

        component.loading$.subscribe((v) => loading.push(v));
        component.openDeleteAllModal(ITEMS);

        expect(loading.length).toBe(3);
        for (let i = 0; i < loading.length; i++) {
          const value = loading[i];
          if (i % 2 === 0) {
            expect(value).toBeFalse();
          } else {
            expect(value).toBeTrue();
          }
        }
      });

      it(`should call disable method on cartForm with correct value when
        deleteAllItems method on CartService returns an error`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteAllItems.and.returnValue(throwError(''));
        fixture.detectChanges();
        const form: FormGroup = component.cartForm;
        spyOn(form, 'disable');
        spyOn(form, 'enable');

        component.openDeleteAllModal(ITEMS);

        expect(form.disable).toHaveBeenCalledOnceWith({
          emitEvent: false,
        });
        expect(form.disable).toHaveBeenCalledBefore(form.enable);
      });

      it(`should call enable method on cartForm with correct value when
        deleteAllItems method on CartService returns an error`, () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteAllItems.and.returnValue(throwError(''));
        fixture.detectChanges();
        const form: FormGroup = component.cartForm;
        spyOn(form, 'disable');
        spyOn(form, 'enable');

        component.openDeleteAllModal(ITEMS);

        expect(form.enable).toHaveBeenCalledOnceWith({
          emitEvent: false,
        });
      });

      it('should set componentInstance properties on mockModalRef', () => {
        mockNgbModal.open.and.returnValue(mockModalRef);
        mockCartService.deleteAllItems.and.returnValue(of(true));
        fixture.detectChanges();

        component.openDeleteAllModal(ITEMS);

        expect(mockModalRef.componentInstance.message).toBe(
          `Are you sure you want to empty the cart?`
        );
        expect(mockModalRef.componentInstance.closeMessage).toBe('Empty');
      });
    });
  });

  describe('w/o SHIPPINGRATES', () => {
    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let mockCartService;
    let mockShippingRateService;
    let mockNotificationService;
    let mockNgbModal;
    let mockNgbModalConfig;
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
    const QUANTITYOPTIONS: number[] = [0, 1, 2, 3, 4, 5];

    beforeEach(
      waitForAsync(() => {
        mockCartService = jasmine.createSpyObj([], {
          cartItems$: of(ITEMS),
          cartQuantity$: of(getQuantity(ITEMS)),
          quantityOptions: QUANTITYOPTIONS,
        });
        mockShippingRateService = jasmine.createSpyObj(['getDeliveryDate']);
        mockNotificationService = jasmine.createSpyObj(['']);
        mockActivatedRoute = jasmine.createSpyObj([], {
          snapshot: {
            data: {
              resolvedData: RESOLVEDDATA,
            },
          },
        });
        mockTitle = jasmine.createSpyObj(['setTitle']);
        mockNgbModal = jasmine.createSpyObj(['']);
        mockNgbModalConfig = jasmine.createSpyObj([], {
          centered: false,
          backdrop: true,
        });
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule, NgbModule, ReactiveFormsModule],

          declarations: [
            CartComponent,
            FakeErrorReceivedComponent,
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

    it('should have set pageTitle correctly', () => {
      fixture.detectChanges();

      expect(component.pageTitle).toBe('Retrieval Error');
    });

    it('should have set cartForm correctly', () => {
      fixture.detectChanges();

      expect(component.cartForm).toBeUndefined();
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

    it('should have set quantityOptions correctly', () => {
      fixture.detectChanges();

      expect(component.quantityOptions).toEqual(QUANTITYOPTIONS);
    });

    it('should have set quantities$ correctly', () => {
      let formArray: FormArray;
      fixture.detectChanges();

      component.quantities$.subscribe((value) => (formArray = value));

      expect(formArray).toBeNull();
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
    let mockShippingRateService;
    let mockNotificationService;
    let mockActivatedRoute;
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
    const QUANTITYOPTIONS: number[] = [0, 1, 2, 3, 4, 5];

    beforeEach(
      waitForAsync(() => {
        mockCartService = jasmine.createSpyObj(['saveItem'], {
          cartItems$: of(ITEMS),
          cartQuantity$: of(getQuantity(ITEMS)),
          quantityOptions: QUANTITYOPTIONS,
        });
        mockActivatedRoute = jasmine.createSpyObj([], {
          snapshot: {
            data: {
              resolvedData: RESOLVEDDATA,
            },
          },
        });
        mockNotificationService = jasmine.createSpyObj(['']);
        mockTitle = jasmine.createSpyObj(['setTitle']);
        mockNgbModal = jasmine.createSpyObj(['']);
        mockNgbModalConfig = jasmine.createSpyObj([], {
          centered: false,
          backdrop: true,
        });
        mockShippingRateService = jasmine.createSpyObj(
          ['setShipping', 'getDeliveryDate'],
          {
            shippingPriceSelectedAction$: of(SHIPPINGRATES[0].price),
          }
        );
        TestBed.configureTestingModule({
          imports: [
            HttpClientTestingModule,
            ReactiveFormsModule,
            RouterTestingModule,
          ],

          declarations: [
            CartComponent,
            CartSummaryComponent,
            ErrorReceivedComponent,
            MockCapitalizePipe,
          ],

          providers: [
            { provide: CartService, useValue: mockCartService },
            { provide: Title, useValue: mockTitle },
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

    it('should set cartForm in the template', () => {
      let items: ICartItem[];
      fixture.detectChanges();
      component.items$.subscribe((i) => (items = i));

      const tabelRowElements = fixture.debugElement.queryAll(
        By.css('tbody tr')
      );
      expect(tabelRowElements.length).toBe(items.length);
      for (let i = 0; i < tabelRowElements.length; i++) {
        const tableCellElements: DebugElement[] = tabelRowElements[i].queryAll(
          By.css('td')
        );
        const formElements: DebugElement[] = tableCellElements[3].queryAll(
          By.css(`form`)
        );
        expect(formElements.length).toBe(1);
      }
    });

    it('should not set ErrorReceivedComponent in the template', () => {
      // run ngOnInit
      fixture.detectChanges();

      const ErrorReceivedComponentDEs = fixture.debugElement.queryAll(
        By.directive(ErrorReceivedComponent)
      );
      expect(ErrorReceivedComponentDEs.length).toBe(0);
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
      expect(tabelRowElements.length).toBe(items.length);
      for (let i = 0; i < tabelRowElements.length; i++) {
        let elements: DebugElement[];
        const tableCellElements = tabelRowElements[i].queryAll(By.css('td'));

        elements = tableCellElements[0].queryAll(By.css('img'));
        expect(elements.length).toBe(1);
        expect(elements[0].nativeElement.src).toContain(items[i].imageUrl);
        expect(elements[0].nativeElement.title).toBe(items[i].name);

        elements = tableCellElements[1].queryAll(By.css('a'));
        expect(elements.length).toBe(1);
        expect(elements[0].nativeElement.textContent).toBe(items[i].name);

        elements = tableCellElements[2].queryAll(By.css('span'));
        expect(elements.length).toBe(1);
        expect(elements[0].nativeElement.textContent).toBe(
          formatCurrency(items[i].price, 'en-US', '$')
        );
      }
    });

    it('should set quantityOptions in the template', () => {
      // run ngOnInit
      fixture.detectChanges();

      // item debug elements
      const tabelRowElements = fixture.debugElement.queryAll(
        By.css('tbody tr')
      );
      for (let i = 0; i < tabelRowElements.length; i++) {
        const tableCellElements = tabelRowElements[i].queryAll(By.css('td'));
        const selectElements: DebugElement[] = tableCellElements[3].queryAll(
          By.css('select')
        );
        const quantityOptions: number[] = component.quantityOptions;
        for (let i = 0; i < quantityOptions.length; i++) {
          expect(+selectElements[0].nativeElement.options[i].value).toBe(
            quantityOptions[i]
          );
        }
        expect(selectElements.length).toBe(1);
      }
    });

    it('should set quantities$ in the template', () => {
      // run ngOnInit
      let quantities: FormArray;
      let items: ICartItem[];
      fixture.detectChanges();
      component.quantities$.subscribe((q) => (quantities = q));
      component.items$.subscribe((i) => (items = i));

      // item debug elements
      const tabelRowElements = fixture.debugElement.queryAll(
        By.css('tbody tr')
      );
      expect(tabelRowElements.length).toBe(quantities.length);
      for (let i = 0; i < tabelRowElements.length; i++) {
        const tableCellElements = tabelRowElements[i].queryAll(By.css('td'));
        const selectDEs: DebugElement[] = tableCellElements[3].queryAll(
          By.css('select')
        );
        expect(selectDEs.length).toBe(1);
        expect(+selectDEs[0].nativeElement.value).toBe(items[i].quantity);
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

        path = `/products/${items[i].type}/${items[i].id}?returnLink=%2Fcart%2Fsummary`;
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

    it(`should call openDeleteModal method with correct value when cartForm is
      submitted`, () => {
      let items: ICartItem[];
      spyOn(component, 'openDeleteModal');
      fixture.detectChanges();
      component.items$.subscribe((i) => (items = i as ICartItem[]));

      const tabelRowElements = fixture.debugElement.queryAll(
        By.css('tbody tr')
      );
      expect(tabelRowElements.length).toBe(items.length);
      for (let i = 0; i < tabelRowElements.length; i++) {
        const tableCellElements: DebugElement[] = tabelRowElements[i].queryAll(
          By.css('td')
        );
        const formElements: DebugElement[] = tableCellElements[3].queryAll(
          By.css(`form`)
        );
        formElements[0].triggerEventHandler('ngSubmit', null);
        expect(tableCellElements.length).toBe(4);
        expect(formElements.length).toBe(1);
      }
      expect(component.openDeleteModal).toHaveBeenCalledTimes(
        tabelRowElements.length
      );
    });

    it(`should call openDeleteAllModal method with correct value when empty
      input button is clicked`, () => {
      // Arrange
      let items: ICartItem[];
      spyOn(component, 'openDeleteAllModal');
      fixture.detectChanges();
      component.items$.subscribe((i) => (items = i as ICartItem[]));

      // Act
      const input = fixture.debugElement.queryAll(By.css('#emptyBtn'));
      input[0].triggerEventHandler('click', null);

      // Assert
      expect(input.length).toBe(1);
      expect(component.openDeleteAllModal).toHaveBeenCalledOnceWith(items);
    });

    it('should update select value when model value has changed', () => {
      mockCartService.saveItem.and.returnValue(of(true));
      fixture.detectChanges();
      const quantitiesArray = component.cartForm.get('quantities') as FormArray;
      const tabelRowElements = fixture.debugElement.queryAll(
        By.css('tbody tr')
      );
      for (let i = 0; i < quantitiesArray.controls.length; i++) {
        const control: AbstractControl = quantitiesArray.controls[i];
        const tableCellElements = tabelRowElements[i].queryAll(By.css('td'));
        const selectDEs: DebugElement[] = tableCellElements[3].queryAll(
          By.css('select')
        );
        const newValue: number = +control.get('quantity').value + 1;
        control.patchValue({
          quantity: newValue,
        });
        expect(+selectDEs[0].nativeElement.value).toBe(newValue);
      }
    });

    it('should update model value when select value has changed', () => {
      mockCartService.saveItem.and.returnValue(of(true));
      fixture.detectChanges();
      const quantitiesArray = component.cartForm.get('quantities') as FormArray;
      const tabelRowElements = fixture.debugElement.queryAll(
        By.css('tbody tr')
      );
      for (let i = 0; i < quantitiesArray.controls.length; i++) {
        const tableCellElements = tabelRowElements[i].queryAll(By.css('td'));
        const selectDEs: DebugElement[] = tableCellElements[3].queryAll(
          By.css('select')
        );
        const newValue: number = +selectDEs[0].nativeElement.value + 1;

        selectDEs[0].nativeElement.value = newValue;
        selectDEs[0].nativeElement.dispatchEvent(new Event('change'));

        expect(+quantitiesArray.controls[i].value.quantity).toBe(newValue);
      }
    });
  });

  describe('w/o SHIPPINGRATES', () => {
    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let mockCartService;
    let mockNgbModal;
    let mockNgbModalConfig;
    let mockShippingRateService;
    let mockNotificationService;
    let mockActivatedRoute;
    let mockTitle: Title;

    const ERRORMESSAGE = 'Error!';
    const RESOLVEDDATA: ShippingRatesResult = {
      shippingRates: null,
      error: ERRORMESSAGE,
    };

    beforeEach(
      waitForAsync(() => {
        mockCartService = jasmine.createSpyObj(['']);
        mockActivatedRoute = jasmine.createSpyObj([], {
          snapshot: {
            data: {
              resolvedData: RESOLVEDDATA,
            },
          },
        });
        mockNgbModal = jasmine.createSpyObj(['']);
        mockNotificationService = jasmine.createSpyObj(['']);
        mockTitle = jasmine.createSpyObj(['setTitle']);
        mockNgbModal = jasmine.createSpyObj(['']);
        mockNgbModalConfig = jasmine.createSpyObj([], {
          centered: false,
          backdrop: true,
        });
        mockShippingRateService = jasmine.createSpyObj(['']);
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule, ReactiveFormsModule],

          declarations: [
            CartComponent,
            ErrorReceivedComponent,
            MockCapitalizePipe,
          ],

          providers: [
            { provide: CartService, useValue: mockCartService },
            { provide: Title, useValue: mockTitle },
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

    it('should set ErrorReceivedComponent in the template', () => {
      // run ngOnInit
      fixture.detectChanges();

      const ErrorReceivedComponentDEs = fixture.debugElement.queryAll(
        By.directive(ErrorReceivedComponent)
      );
      const instance = <ErrorReceivedComponent>(
        ErrorReceivedComponentDEs[0].componentInstance
      );

      expect(ErrorReceivedComponentDEs.length).toBe(1);
      expect(instance.errorMessage).toBe(component.errorMessage);
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

    it('should not set quantities$ in the template', () => {
      fixture.detectChanges();

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
