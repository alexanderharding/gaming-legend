import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ctacu-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  @Input() pageTitle: string;
  readonly currentYear = new Date().getFullYear();

  constructor() {}
}
