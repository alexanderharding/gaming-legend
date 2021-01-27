import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SuccessComponent } from './success.component';

describe('SuccessComponent', () => {
  let component: SuccessComponent;
  let fixture: ComponentFixture<SuccessComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgbModule],
        declarations: [SuccessComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // Arrange
    fixture.detectChanges();

    // Act

    // Assert
    expect(component).toBeTruthy();
  });

  it('should set the pageTitle correctly', () => {
    // Arrange
    fixture.detectChanges();

    // Act

    // Assert
    expect(component.pageTitle).toBe('Order Placed');
  });
});

describe('SuccessComponent w/ template', () => {
  let component: SuccessComponent;
  let fixture: ComponentFixture<SuccessComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgbModule],
        declarations: [SuccessComponent],
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
