import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { INotification } from '../../types/notification';

import { NotificationsContainerComponent } from './notifications-container.component';

describe('NotificationsContainerComponent', () => {
  let component: NotificationsContainerComponent;
  let fixture: ComponentFixture<NotificationsContainerComponent>;
  let mockNotificationService;

  const NOTIFICATIONS: INotification[] = [
    {
      textOrTpl: 'Error',
      className: 'class1',
      delay: 1500,
    },
    {
      textOrTpl: 'Wow!',
      className: 'class2',
    },
  ];

  beforeEach(
    waitForAsync(() => {
      mockNotificationService = jasmine.createSpyObj(['remove'], {
        notifications$: of(NOTIFICATIONS),
      });
      TestBed.configureTestingModule({
        imports: [NgbModule],
        declarations: [NotificationsContainerComponent],
        providers: [
          { provide: NotificationService, useValue: mockNotificationService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set notifications$ correctly', () => {
    let notifications: INotification[];

    component.notifications$.subscribe((n) => (notifications = n));

    expect(notifications.length).toBe(NOTIFICATIONS.length);
    expect(notifications).toBe(NOTIFICATIONS);
  });

  describe('remove', () => {
    it(`should call remove method on NotificationService w/ correct
      value`, () => {
      fixture.detectChanges();

      component.remove(NOTIFICATIONS[0]);

      expect(mockNotificationService.remove).toHaveBeenCalledTimes(1);
      expect(mockNotificationService.remove).toHaveBeenCalledWith(
        NOTIFICATIONS[0]
      );
    });
  });

  describe('isTemplate', () => {
    it(`should return correct value`, () => {
      fixture.detectChanges();

      expect(NOTIFICATIONS[0].textOrTpl).toBeInstanceOf(String);
      expect(component.isTemplate(NOTIFICATIONS[0])).toBeFalse();
    });
  });
});

describe('NotificationsContainerComponent w/ template', () => {
  let component: NotificationsContainerComponent;
  let fixture: ComponentFixture<NotificationsContainerComponent>;
  let mockNotificationService;

  const NOTIFICATIONS: INotification[] = [
    {
      textOrTpl: 'Error',
      className: 'class1',
      delay: 1500,
    },
    {
      textOrTpl: 'Wow!',
      className: 'class2',
    },
  ];

  beforeEach(
    waitForAsync(() => {
      mockNotificationService = jasmine.createSpyObj(['remove'], {
        notifications$: of(NOTIFICATIONS),
      });
      TestBed.configureTestingModule({
        imports: [NgbModule],
        declarations: [NotificationsContainerComponent],
        providers: [
          { provide: NotificationService, useValue: mockNotificationService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set notifications$ correctly in template', () => {
    spyOn(component, 'isTemplate');
    fixture.detectChanges();

    const toastElements = fixture.debugElement.queryAll(By.css('ngb-toast'));
    expect(toastElements.length).toBe(NOTIFICATIONS.length);
    for (let i = 0; i < toastElements.length; i++) {
      expect(toastElements[i].nativeElement).toHaveClass(
        NOTIFICATIONS[i].className
      );
      expect(component.isTemplate).toHaveBeenCalledWith(NOTIFICATIONS[i]);
    }
    expect(component.isTemplate).toHaveBeenCalledTimes(NOTIFICATIONS.length);
  });

  it(`should call remove method with correct value when ngb-toast is
    clicked`, () => {
    const index = 0;
    spyOn(component, 'remove');
    fixture.detectChanges();

    const toastElements = fixture.debugElement.queryAll(By.css('ngb-toast'));
    toastElements[index].triggerEventHandler('click', null);

    expect(component.remove).toHaveBeenCalledTimes(1);
    expect(component.remove).toHaveBeenCalledWith(NOTIFICATIONS[index]);
  });

  it(`should call remove method with correct value when ngb-toast is
    hidden`, () => {
    const index = 0;
    spyOn(component, 'remove');
    fixture.detectChanges();

    const toastElements = fixture.debugElement.queryAll(By.css('ngb-toast'));
    toastElements[index].triggerEventHandler('hidden', null);

    expect(component.remove).toHaveBeenCalledTimes(1);
    expect(component.remove).toHaveBeenCalledWith(NOTIFICATIONS[index]);
  });
});
