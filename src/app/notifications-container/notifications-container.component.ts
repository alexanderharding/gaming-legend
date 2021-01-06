import { Component, OnInit, TemplateRef } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'ctacu-notifications-container',
  templateUrl: './notifications-container.component.html',
  styleUrls: ['./notifications-container.component.scss'],
  host: { '[class.ngb-toasts]': 'true' },
})
export class NotificationsContainerComponent implements OnInit {
  notifications = this.notificationService.notifications;
  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit(): void {}

  isTemplate(notification) {
    return notification.textOrTpl instanceof TemplateRef;
  }

  remove(notification): void {
    this.notificationService.remove(notification);
  }
}
