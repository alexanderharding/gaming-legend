import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmModalComponent } from './confirm-modal.component';

@Pipe({
  name: 'capitalize',
})
class MockCapitalizePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;
  let mockNgbActiveModal;

  beforeEach(
    waitForAsync(() => {
      mockNgbActiveModal = jasmine.createSpyObj(['dismiss', 'close']);
      TestBed.configureTestingModule({
        declarations: [ConfirmModalComponent, MockCapitalizePipe],
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

  it('should have set message correctly', () => {
    expect(component.message).toBeFalsy();
  });

  it('should have set closeMessage correctly', () => {
    expect(component.closeMessage).toBe('ok');
  });

  it('should have set dissmissMessage correctly', () => {
    expect(component.dismissMessage).toBe('cancel');
  });

  describe('dismiss', () => {
    it(`should call dismiss method on NgbActiveModal with the correct
      value`, () => {
      const reason = 'dismiss';

      component.dismiss(reason);

      expect(mockNgbActiveModal.dismiss).toHaveBeenCalledWith(reason);
    });
  });

  describe('close', () => {
    it(`should call close method on NgbActiveModal with the correct
      value`, () => {
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
        declarations: [ConfirmModalComponent, MockCapitalizePipe],
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
    const elements = fixture.debugElement.queryAll(By.css('h5'));
    expect(elements.length).toBe(1);
    expect(elements[0].nativeElement.textContent).toBe(component.message);
  });

  it('should set the closeMessage in the template', () => {
    // Arrange
    component.closeMessage = 'close';

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('input'));
    expect(elements.length).toBe(2);
    expect(elements[1].nativeElement.value).toContain(component.closeMessage);
  });

  it('should set the dismissMessage in the template', () => {
    // Arrange
    component.dismissMessage = 'dismiss';

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('input'));
    expect(elements.length).toBe(2);
    expect(elements[0].nativeElement.value).toContain(component.dismissMessage);
  });

  it(`should call dismiss method when cross button is clicked`, () => {
    spyOn(fixture.componentInstance, 'dismiss');
    fixture.detectChanges();
    const buttonDEs = fixture.debugElement.queryAll(By.css('button'));

    buttonDEs[0].triggerEventHandler('click', {});

    expect(buttonDEs.length).toBe(1);
    expect(fixture.componentInstance.dismiss).toHaveBeenCalledWith(
      'cross click'
    );
  });

  it(`should call dismiss method when cancel input button is clicked`, () => {
    spyOn(fixture.componentInstance, 'dismiss');
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.css('input'));

    elements[0].triggerEventHandler('click', {});

    expect(elements.length).toBe(2);
    expect(fixture.componentInstance.dismiss).toHaveBeenCalledWith(
      'cancel click'
    );
  });

  it(`should call close method when ok input button is clicked`, () => {
    spyOn(fixture.componentInstance, 'close');
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.css('input'));

    elements[1].triggerEventHandler('click', {});

    expect(elements.length).toBe(2);
    expect(fixture.componentInstance.close).toHaveBeenCalledWith('ok click');
  });
});
