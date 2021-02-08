import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductTypesComponent } from './product-types.component';

xdescribe('ProductTypesComponent', () => {
  let component: ProductTypesComponent;
  let fixture: ComponentFixture<ProductTypesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ProductTypesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
