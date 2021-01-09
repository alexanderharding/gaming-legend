import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'ctacu-notifications-container',
  templateUrl: './notifications-container.component.html',
  styleUrls: ['./notifications-container.component.scss'],
  host: { '[class.ngb-toasts]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsContainerComponent {
  notifications$ = this.notificationService.notifications$;

  constructor(private readonly notificationService: NotificationService) {}

  remove(notification): void {
    this.notificationService.remove(notification);
  }
}
