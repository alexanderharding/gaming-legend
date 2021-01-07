import { Injectable, TemplateRef } from '@angular/core';
import { INotification } from '../types/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifications: INotification[] = [];

  constructor() {}

  show(notification: INotification): void {
    this.notifications.push(notification);
  }

  remove(notification: INotification): void {
    this.notifications = this.notifications.filter((t) => t !== notification);
  }
}
