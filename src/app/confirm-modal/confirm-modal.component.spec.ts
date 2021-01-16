import {
  async,
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ConfirmModalComponent],
        providers: [NgbActiveModal],
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

describe('ConfirmModalComponent w/ template', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ConfirmModalComponent],
        providers: [NgbActiveModal],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
  });

  it('should set the title in the template', () => {
    // Arrange
    component.title = 'title';

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('h4'));
    expect(elements[0].nativeElement.textContent).toContain(component.title);
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

  it('should set the warningMessage in the template', () => {
    // Arrange
    component.warningMessage = 'warning message';

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('p strong'));
    expect(elements[1].nativeElement.textContent).toContain(
      component.warningMessage
    );
  });

  it('should set the infoMessage in the template w/o warning message', () => {
    // Arrange
    component.infoMessage = 'info message';
    component.warningMessage = null;

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('p strong'));
    expect(elements[1].nativeElement.textContent).toContain(
      component.infoMessage
    );
  });

  it('should set the infoMessage in the template w/ warning message', () => {
    // Arrange
    component.infoMessage = 'info message';
    component.warningMessage = 'warning message';

    // Act
    fixture.detectChanges();

    // Assert
    const elements = fixture.debugElement.queryAll(By.css('p strong'));
    expect(elements[2].nativeElement.textContent).toContain(
      component.infoMessage
    );
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
});
