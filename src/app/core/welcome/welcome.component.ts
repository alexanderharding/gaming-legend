import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit {
  readonly pageTitle = 'Welcome';
  readonly welcomeMessage = `A top-of-the-line PC will outpace many gaming
    consoles when it comes to sheer computing power, but many low- to mid-tier
    computers also provide great gaming experiences. PC gaming is largely about
    customization, giving you a vast array of hardware and accessories to choose
    from. No matter how you want to game, Gaming Legend has the perfect
    hardware for you.`;

  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(`Gaming Legend | ${this.pageTitle}`);
  }
}
