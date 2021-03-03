import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By, Title } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderPlacedComponent } from './order-placed.component';

@Pipe({
  name: 'capitalize',
})
class MockCapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (value === undefined || value === null || value.length === 0) {
      return value;
    }
    const words = value.split(' ');
    const capitalizedWords = [];
    words.forEach((w) =>
      capitalizedWords.push(
        w[0].toUpperCase() + w.slice(1, w.length).toLowerCase()
      )
    );
    return capitalizedWords.join(' ');
  }
}

describe('OrderPlacedComponent', () => {
  let component: OrderPlacedComponent;
  let fixture: ComponentFixture<OrderPlacedComponent>;
  let mockTitle: Title;

  beforeEach(
    waitForAsync(() => {
      mockTitle = jasmine.createSpyObj(['setTitle']);
      TestBed.configureTestingModule({
        imports: [NgbModule],
        declarations: [OrderPlacedComponent, MockCapitalizePipe],
        providers: [{ provide: Title, useValue: mockTitle }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPlacedComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // Arrange

    // Act
    fixture.detectChanges();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should have set pageTitle correctly', () => {
    // Arrange

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.pageTitle).toBe('Order Placed');
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

describe('OrderPlacedComponent w/ template', () => {
  let component: OrderPlacedComponent;
  let fixture: ComponentFixture<OrderPlacedComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgbModule],
        declarations: [OrderPlacedComponent, MockCapitalizePipe],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPlacedComponent);
    component = fixture.componentInstance;
  });

  it('should set the pageTitle in the template', () => {
    // Arrange
    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('h1'));
    expect(elements[0].nativeElement.textContent).toContain(
      component.pageTitle
    );
  });
});
