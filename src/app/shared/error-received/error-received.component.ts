import { Component, Input } from '@angular/core';

@Component({
  selector: 'ctacu-error-received',
  templateUrl: './error-received.component.html',
  styleUrls: ['./error-received.component.scss'],
})
export class ErrorReceivedComponent {
  @Input() errorMessage: string;

  constructor() {}
}
