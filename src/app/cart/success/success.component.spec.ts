import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SuccessComponent } from './success.component';

describe('SuccessComponent', () => {
  let component: SuccessComponent;
  let fixture: ComponentFixture<SuccessComponent>;

  @Component({
    selector: 'ngb-alert',
    template: '<div></div>',
  })
  class FakeNgbAlertComponent {}

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SuccessComponent, FakeNgbAlertComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // Arrange

    // Act

    // Assert
    expect(component).toBeTruthy();
  });

  it('should set the pageTitle correctly', () => {
    // Arrange
    // Act
    // Assert
    expect(component.pageTitle).toBe('Order Placed');
  });
});

describe('SuccessComponent w/ template', () => {
  let component: SuccessComponent;
  let fixture: ComponentFixture<SuccessComponent>;

  @Component({
    selector: 'ngb-alert',
    template: '<div></div>',
  })
  class FakeNgbAlertComponent {}

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SuccessComponent, FakeNgbAlertComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessComponent);
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
