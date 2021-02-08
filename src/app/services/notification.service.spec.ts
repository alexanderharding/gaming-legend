import { TestBed } from '@angular/core/testing';
import { INotification } from '../types/notification';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let notifications: INotification[];
  let notification: INotification;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('notifications$', () => {
    it('should have no notifications to start', () => {
      // Arrange
      notifications = [];

      // Act
      service.notifications$.subscribe((n) => (notifications = n));

      // Assert
      expect(notifications.length).toBe(0);
    });

    it('should add a notification when show is called', () => {
      // Arrange
      notifications = [];
      notification = {
        textOrTpl: 'Success message!',
        className: 'bg-success text-light',
      };

      // Act
      service.show(notification);
      service.notifications$.subscribe((n) => (notifications = n));

      // Assert
      expect(notifications.length).toBe(1);
    });

    it('should remove notification when remove is called', () => {
      // Arrange
      notifications = [];
      notification = {
        textOrTpl: 'Success message!',
        className: 'bg-success text-light',
      };
      service.show(notification);
      service.notifications$.subscribe((n) => (notifications = n));
      expect(notifications.length).toBe(1);

      // Act
      service.remove(notification);
      service.notifications$.subscribe((n) => (notifications = n));

      // Assert
      expect(notifications.length).toBe(0);
    });
  });
});
