import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  @Component({
    selector: 'ngb-alert',
    template: '<div></div>',
  })
  class FakeNgbAlertComponent {}

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NotFoundComponent, FakeNgbAlertComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
