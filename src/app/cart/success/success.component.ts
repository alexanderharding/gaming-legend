import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessComponent implements OnInit {
  readonly pageTitle = 'Order Placed';

  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(`Gaming Legend | ${this.pageTitle}`);
  }
}
