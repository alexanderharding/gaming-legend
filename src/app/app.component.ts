import { Component, OnInit } from '@angular/core';

import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
} from '@angular/router';

import { slideInAnimation } from './app.animation';

@Component({
  selector: 'ctacu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation],
})
export class AppComponent implements OnInit {
  readonly pageTitle = 'Gaming Legend';
  loading = false;
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  private checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }

    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationError ||
      routerEvent instanceof NavigationCancel
    ) {
      this.loading = false;
    }
  }
}
