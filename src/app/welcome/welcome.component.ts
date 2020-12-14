import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent {
  readonly pageTitle = 'Gaming Legend';

  constructor() {}
}
