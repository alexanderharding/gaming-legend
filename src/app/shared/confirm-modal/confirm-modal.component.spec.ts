import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;
  let mockNgbActiveModal;

  beforeEach(
    waitForAsync(() => {
      mockNgbActiveModal = jasmine.createSpyObj(['dismiss', 'close']);
      TestBed.configureTestingModule({
        declarations: [ConfirmModalComponent],
        providers: [{ provide: NgbActiveModal, useValue: mockNgbActiveModal }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no message to start', () => {
    expect(component.message).toBeFalsy();
  });

  it('should have "ok" as closeMessage message to start', () => {
    expect(component.closeMessage).toEqual('ok');
  });

  it('should have "cancel" as dismissMessage message to start', () => {
    expect(component.dismissMessage).toEqual('cancel');
  });

  describe('dismiss', () => {
    it('should call dismiss with the correct value', () => {
      const reason = 'dismiss';

      component.dismiss(reason);

      expect(mockNgbActiveModal.dismiss).toHaveBeenCalledWith(reason);
    });
  });

  describe('close', () => {
    it('should call close with the correct value', () => {
      const reason = 'close';

      component.close(reason);

      expect(mockNgbActiveModal.close).toHaveBeenCalledWith(reason);
    });
  });
});

describe('ConfirmModalComponent w/ template', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;
  let mockNgbActiveModal;

  beforeEach(
    waitForAsync(() => {
      mockNgbActiveModal = jasmine.createSpyObj(['']);
      TestBed.configureTestingModule({
        declarations: [ConfirmModalComponent],
        providers: [{ provide: NgbActiveModal, useValue: mockNgbActiveModal }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
  });

  it('should set the message in the template', () => {
    // Arrange
    component.message = 'message';

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('p strong'));
    expect(elements[0].nativeElement.textContent).toContain(component.message);
  });

  it('should set the closeMessage in the template', () => {
    // Arrange
    component.closeMessage = 'close';

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('button'));
    expect(elements[1].nativeElement.textContent).toContain(
      component.closeMessage
    );
  });

  it('should set the dismissMessage in the template', () => {
    // Arrange
    component.dismissMessage = 'dismiss';

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('button'));
    expect(elements[2].nativeElement.textContent).toContain(
      component.dismissMessage
    );
  });

  it(`should call dismiss method when the ConfirmModal Component's
    cross button is clicked`, () => {
    spyOn(fixture.componentInstance, 'dismiss');

    const button = fixture.debugElement.queryAll(By.css('button'))[0];
    button.triggerEventHandler('click', {});

    expect(fixture.componentInstance.dismiss).toHaveBeenCalledWith(
      'cross click'
    );
  });

  it(`should call dismiss method when the ConfirmModal Component's cancel
    button is clicked`, () => {
    spyOn(fixture.componentInstance, 'dismiss');

    const button = fixture.debugElement.queryAll(By.css('button'))[2];
    button.triggerEventHandler('click', {});

    expect(fixture.componentInstance.dismiss).toHaveBeenCalledWith(
      'cancel click'
    );
  });

  it(`should call close method when the ConfirmModal Component's ok button is
    clicked`, () => {
    spyOn(fixture.componentInstance, 'close');

    const button = fixture.debugElement.queryAll(By.css('button'))[1];
    button.triggerEventHandler('click', {});

    expect(fixture.componentInstance.close).toHaveBeenCalledWith('ok click');
  });
});
