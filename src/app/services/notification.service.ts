import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifications: any[] = [];

  constructor() {}

  show(textOrTpl: string | TemplateRef<any>, options: any = {}): void {
    this.notifications.push({ textOrTpl, ...options });
  }

  remove(notification: any): void {
    this.notifications = this.notifications.filter((t) => t !== notification);
  }
}
