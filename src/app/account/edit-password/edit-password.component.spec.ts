import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditPasswordComponent } from './edit-password.component';

xdescribe('EditPasswordComponent', () => {
  let component: EditPasswordComponent;
  let fixture: ComponentFixture<EditPasswordComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditPasswordComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
