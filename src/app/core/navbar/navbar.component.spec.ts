import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { CartService } from '../cart.service';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockCartService;

  const CARTQUANTITY = 2;

  beforeEach(
    waitForAsync(() => {
      mockCartService = jasmine.createSpyObj([], {
        cartQuantity$: of(CARTQUANTITY),
      });
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgbModule, RouterTestingModule],
        declarations: [NavbarComponent],
        providers: [{ provide: CartService, useValue: mockCartService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have set cartQuantity$ correctly', () => {
    let quantity: number;
    fixture.detectChanges();

    component.cartQuantity$.subscribe((q) => (quantity = q));

    expect(quantity).toBe(CARTQUANTITY);
  });

  it('should have set isMenuCollapsed correctly', () => {
    fixture.detectChanges();

    expect(component.isMenuCollapsed).toBeTrue();
  });
});

describe('NavbarComponent w/ template', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockCartService;

  const TITLE = 'Gaming Legend';
  const CARTQUANTITY = 2;

  beforeEach(
    waitForAsync(() => {
      mockCartService = jasmine.createSpyObj(['getCartItems'], {
        cartQuantity$: of(CARTQUANTITY),
      });
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgbModule, RouterTestingModule],
        declarations: [NavbarComponent],
        providers: [{ provide: CartService, useValue: mockCartService }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set the pageTitle in the template', () => {
    // Arrange
    component.pageTitle = TITLE;

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('nav a'));
    expect(elements[0].nativeElement.textContent).toContain(TITLE);
  });

  it('should set the cartQuantity$ in the template', () => {
    // Arrange
    component.pageTitle = TITLE;

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('li a'));
    expect(elements[2].nativeElement.textContent).toContain(CARTQUANTITY);
  });

  it('should set the routerLink paths in the template', () => {
    let path: string;
    fixture.detectChanges();

    const elements = fixture.debugElement.queryAll(By.css('a'));
    expect(elements.length).toBe(4);
    path = elements[0].nativeElement.getAttribute('routerLink');
    expect(path).toBe('/welcome');
    path = elements[1].nativeElement.getAttribute('routerLink');
    expect(path).toBe('/welcome');
    path = elements[2].nativeElement.getAttribute('routerLink');
    expect(path).toBe('/products');
    path = elements[3].nativeElement.getAttribute('routerLink');
    expect(path).toBe('/cart');
  });

  // fit('should behave...', () => {
  //   mockCartService.getCartItems.and.returnValue(of(true));

  //   fixture.detectChanges();
  //   const elements = fixture.debugElement.queryAll(By.css('a'));

  //   let routerLink = elements[1]
  //     .query(By.directive(RouterLinkDirectiveStub))
  //     .injector.get(RouterLinkDirectiveStub);

  //   elements[2].triggerEventHandler('click', {});

  //   expect(routerLink.navigatedTo).toBe('');
  // });
});
