import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessComponent {
  readonly pageTitle = 'Order Placed';

  constructor() {}
}
