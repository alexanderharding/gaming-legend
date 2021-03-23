import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INotification } from '../types/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications: INotification[] = [];
  private readonly notificationSubject = new BehaviorSubject<INotification[]>(
    this.notifications
  );
  readonly notifications$ = this.notificationSubject.asObservable();

  constructor() {}

  show(notification: INotification): void {
    this.notifications.push(notification);
    this.notificationSubject.next(this.notifications);
  }

  remove(notification: INotification): void {
    this.notifications = this.notifications.filter((n) => n !== notification);
    this.notificationSubject.next(this.notifications);
  }
}
