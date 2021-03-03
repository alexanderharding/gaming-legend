import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from '../app-routing.module';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { NotificationService } from '../services/notification.service';
import { INotification } from '../types/notification';
import { IUser } from '../types/user';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockCartService;
  let mockNotificationService;
  let mockAuthService;
  let USER: IUser;
  let CARTQUANTITY: number;

  beforeEach(
    waitForAsync(() => {
      CARTQUANTITY = 2;
      USER = {
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        contact: {
          phone: '8011231234',
          email: 'test@test.com',
        },
        address: {
          street: '123 S Bend Ct',
          city: 'Las Vegas',
          state: 'Nevada',
          zip: '12345',
          country: 'USA',
        },
        password: 'TestPassword1234',
        isAdmin: true,
        id: 121014,
      };
      mockCartService = jasmine.createSpyObj(['getCartItems'], {
        cartQuantity$: of(CARTQUANTITY),
      });
      mockNotificationService = jasmine.createSpyObj(['show']);
      mockAuthService = jasmine.createSpyObj([''], { currentUser$: of(USER) });
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgbModule, AppRoutingModule],
        declarations: [NavbarComponent],
        providers: [
          { provide: CartService, useValue: mockCartService },
          { provide: AuthService, useValue: mockAuthService },
          { provide: NotificationService, useValue: mockNotificationService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockCartService.getCartItems.and.returnValue(of(true));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have set cartQuantity$ correctly', () => {
    let quantity: number;
    mockCartService.getCartItems.and.returnValue(of(true));
    fixture.detectChanges();

    component.cartQuantity$.subscribe((q) => (quantity = q));

    expect(quantity).toBe(CARTQUANTITY);
  });

  // it('should have set currentUser$ correctly', () => {
  //   let user: IUser;
  //   mockCartService.getCartItems.and.returnValue(of(true));
  //   fixture.detectChanges();

  //   component.currentUser$.subscribe((u) => (user = u));

  //   expect(user).toBe(USER);
  // });

  it('should have set isMenuCollapsed correctly', () => {
    mockCartService.getCartItems.and.returnValue(of(true));

    fixture.detectChanges();

    expect(component.isMenuCollapsed).toBeTruthy();
  });

  it(`should have retrieve called getCartItems method on the
    CartService`, () => {
    // Arrange
    mockCartService.getCartItems.and.returnValue(of(true));

    // Act
    fixture.detectChanges();

    // Assert
    expect(mockCartService.getCartItems).toHaveBeenCalledTimes(1);
  });

  it(`should have not called show method on the NotificationService`, () => {
    // Arrange
    mockCartService.getCartItems.and.returnValue(of(true));

    // Act
    fixture.detectChanges();

    // Assert
    expect(mockNotificationService.show).toHaveBeenCalledTimes(0);
  });

  it(`should have called show method on the NotificationService with correct
    value when getCartItems method on the CartService throws an error`, () => {
    // Arrange
    let notification: INotification;
    mockCartService.getCartItems.and.returnValue(throwError(''));

    // Act
    fixture.detectChanges();
    notification = {
      textOrTpl: 'Cart Retrieval Error !',
      className: 'bg-danger text-light',
      delay: 15000,
    };

    // Assert
    expect(mockNotificationService.show).toHaveBeenCalledTimes(1);
    expect(mockNotificationService.show).toHaveBeenCalledWith(notification);
  });
});

describe('NavbarComponent w/ template', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockCartService;
  let mockAuthService;
  let USER: IUser;
  let CARTQUANTITY: number;
  let TITLE: string;

  beforeEach(
    waitForAsync(() => {
      TITLE = 'Gaming Legend';
      CARTQUANTITY = 2;
      USER = {
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        contact: {
          phone: '8011231234',
          email: 'test@test.com',
        },
        address: {
          street: '123 S Bend Ct',
          city: 'Las Vegas',
          state: 'Nevada',
          zip: '12345',
          country: 'USA',
        },
        password: 'TestPassword1234',
        isAdmin: true,
        id: 121014,
      };
      mockCartService = jasmine.createSpyObj(['getCartItems'], {
        cartQuantity$: of(CARTQUANTITY),
      });
      mockAuthService = jasmine.createSpyObj([''], { currentUser$: of(USER) });
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgbModule, AppRoutingModule],
        declarations: [NavbarComponent],
        providers: [
          { provide: CartService, useValue: mockCartService },
          { provide: AuthService, useValue: mockAuthService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockCartService.getCartItems.and.returnValue(of(true));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set the pageTitle in the template', () => {
    // Arrange
    mockCartService.getCartItems.and.returnValue(of(true));
    component.pageTitle = TITLE;

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('nav a'));
    expect(elements[0].nativeElement.textContent).toContain(TITLE);
  });

  it('should set the cartQuantity$ in the template', () => {
    // Arrange
    mockCartService.getCartItems.and.returnValue(of(true));
    component.pageTitle = TITLE;

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('li a'));
    expect(elements[2].nativeElement.textContent).toContain(CARTQUANTITY);
  });

  // it('should set the currentUser$ in the template', () => {
  //   // Arrange
  //   mockCartService.getCartItems.and.returnValue(of(true));

  //   // Act
  //   fixture.detectChanges();

  //   // Assert
  //   const elements = fixture.debugElement.queryAll(By.css('li a'));
  //   expect(elements[3].nativeElement.textContent).toContain(
  //     USER.name.firstName.toLocaleLowerCase()
  //   );
  // });
});
