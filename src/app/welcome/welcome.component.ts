import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit {
  readonly pageTitle = 'Gaming Legend';

  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(`${this.pageTitle} | Welcome`);
  }
}
