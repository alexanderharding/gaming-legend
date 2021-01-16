import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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
