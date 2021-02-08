import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { INotification } from '../types/notification';

@Component({
  selector: 'ctacu-notifications-container',
  templateUrl: './notifications-container.component.html',
  styleUrls: ['./notifications-container.component.scss'],
  host: { '[class.ngb-toasts]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsContainerComponent {
  readonly notifications$ = this.notificationService.notifications$;

  constructor(private readonly notificationService: NotificationService) {}

  isTemplate(notification: INotification): boolean {
    return notification.textOrTpl instanceof TemplateRef;
  }

  remove(notification): void {
    this.notificationService.remove(notification);
  }
}
