import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingPanelContentComponent } from './shipping-panel-content.component';

describe('ShippingPanelContentComponent', () => {
  let component: ShippingPanelContentComponent;
  let fixture: ComponentFixture<ShippingPanelContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingPanelContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingPanelContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
