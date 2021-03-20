import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorReceivedComponent } from './error-received.component';

describe('ErrorReceivedComponent', () => {
  let component: ErrorReceivedComponent;
  let fixture: ComponentFixture<ErrorReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorReceivedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
