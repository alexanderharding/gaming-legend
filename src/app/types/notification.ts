import { TemplateRef } from '@angular/core';

export interface INotification {
  textOrTpl: string | TemplateRef<any>;
  className: string;
  delay?: number;
}
