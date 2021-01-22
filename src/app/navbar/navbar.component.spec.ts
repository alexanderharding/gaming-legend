import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { IUser, User } from '../types/user';

import { NavbarComponent } from './navbar.component';

xdescribe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockCartService;

  @Component({
    selector: 'ngb-alert',
    template: '<div></div>',
  })
  class FakeNgbAlertComponent {}

  beforeEach(
    waitForAsync(() => {
      mockCartService = jasmine.createSpyObj(['getCartItems']);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [NavbarComponent, FakeNgbAlertComponent],
        providers: [{ provide: CartService, useValue: mockCartService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  xit('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have no errorMessage to start', () => {
    fixture.detectChanges();

    expect(component.errorMessage).toBeFalsy();
  });

  it('should have isMenuCollapsed as true to start', () => {
    fixture.detectChanges();

    expect(component.isMenuCollapsed).toBeTruthy();
  });

  it('should retrieve call the getCartItems method on the service', () => {
    // Arrange
    mockCartService.getCartItems.and.returnValue(of(true));

    // Act
    fixture.detectChanges();

    // Assert
    expect(mockCartService.getCartItems).toHaveBeenCalled();
  });
});

xdescribe('NavbarComponent w/ template', () => {
  let component: NavbarComponent,
    fixture: ComponentFixture<NavbarComponent>,
    mockAuthService: AuthService,
    USER: IUser;

  beforeEach(
    waitForAsync(() => {
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
      mockAuthService = jasmine.createSpyObj([''], { currentUser$: of(USER) });
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [NavbarComponent],
        providers: [{ provide: AuthService, userValue: mockAuthService }],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  xit('should set the errorMessage in the template', () => {
    // Arrange
    component.errorMessage = 'Error message!';

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('ngb-alert span'));
    expect(elements[0].nativeElement.textContent).toContain(
      component.errorMessage
    );
  });
});
