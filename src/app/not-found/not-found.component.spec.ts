import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  @Component({
    selector: 'ngb-alert',
    template: '<div></div>',
  })
  class FakeNgbAlertComponent {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotFoundComponent, FakeNgbAlertComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
