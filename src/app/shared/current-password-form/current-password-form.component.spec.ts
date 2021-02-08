import {
  async,
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { CurrentPasswordFormComponent } from './current-password-form.component';

xdescribe('CurrentPasswordFormComponent', () => {
  let component: CurrentPasswordFormComponent;
  let fixture: ComponentFixture<CurrentPasswordFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CurrentPasswordFormComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
