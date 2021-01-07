import { TemplateRef } from '@angular/core';

export interface INotification {
  templateRef: TemplateRef<any>;
  className: string;
  delay?: number;
}
