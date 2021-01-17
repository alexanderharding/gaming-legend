import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CartService } from '../services/cart.service';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockCartService;

  beforeEach(
    waitForAsync(() => {
      mockCartService = jasmine.createSpyObj(['getCartItems']);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [NavbarComponent],
        providers: [{ provide: CartService, useValue: mockCartService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no errorMessage to start', () => {
    expect(component.errorMessage).toBeFalsy();
  });

  it('should have isMenuCollapsed as true to start', () => {
    expect(component.isMenuCollapsed).toBeTruthy();
  });

  it('should retrieve call the getCartItems method on the service', () => {
    // Arrange
    mockCartService.getCartItems.and.returnValue(of(true));

    // Act
    component.ngOnInit();

    // Assert
    expect(mockCartService.getCartItems).toHaveBeenCalled();
  });
});

describe('NavbarComponent w/ template', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  @Component({
    selector: 'ngb-alert',
    template: '<div></div>',
  })
  class FakeNgbAlertComponent {}

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [NavbarComponent, FakeNgbAlertComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should set the errorMessage in the template', () => {
    // Arrange
    component.errorMessage = 'Error message!';

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('span'));
    expect(elements[0].nativeElement.textContent).toContain(
      component.errorMessage
    );
  });
});
