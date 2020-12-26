import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPasswordFormComponent } from './current-password-form.component';

describe('CurrentPasswordFormComponent', () => {
  let component: CurrentPasswordFormComponent;
  let fixture: ComponentFixture<CurrentPasswordFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentPasswordFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
