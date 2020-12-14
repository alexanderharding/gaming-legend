import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmModalComponent],
      providers: [NgbActiveModal],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have "confirm" as title to start', () => {
    expect(component.title).toEqual('confirm');
  });

  it('should have no message to start', () => {
    expect(component.message).toBeFalsy();
  });

  it('should have no warningMessage to start', () => {
    expect(component.warningMessage).toBeFalsy();
  });

  it('should have no infoMessage to start', () => {
    expect(component.infoMessage).toBeFalsy();
  });

  it('should have "bg-secondary" as type to start', () => {
    expect(component.type).toEqual('bg-secondary');
  });

  it('should have "ok" as closeMessage message to start', () => {
    expect(component.closeMessage).toEqual('ok');
  });

  it('should have "cancel" as dismissMessage message to start', () => {
    expect(component.dismissMessage).toEqual('cancel');
  });
});
