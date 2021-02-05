import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import {
  TestBed,
  waitForAsync,
  ComponentFixture,
  // fakeAsync,
  // tick,
} from '@angular/core/testing';
import {
  Router,
  // Routes
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
// import { WelcomeComponent } from './welcome/welcome.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let location: Location,
    router: Router,
    app: AppComponent,
    fixture: ComponentFixture<AppComponent>;

  @Component({
    selector: 'ctacu-navbar',
    template: '<div></div>',
  })
  class FakeNavbarComponent {
    @Input() pageTitle: string;
  }

  @Component({
    selector: 'ctacu-footer',
    template: '<div></div>',
  })
  class FakeFooterComponent {
    @Input() pageTitle: string;
  }

  @Component({
    selector: 'ctacu-notifications-container',
    template: '<div></div>',
  })
  class FakeNotificationsContainerComponent {}

  // const ROUTES: Routes = [{ path: 'welcome', component: WelcomeComponent }];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, BrowserAnimationsModule],
        declarations: [
          AppComponent,
          FakeNavbarComponent,
          FakeFooterComponent,
          FakeNotificationsContainerComponent,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    // router = TestBed.inject(Router);
    // location = TestBed.inject(Location);

    // router.initialNavigation();
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(app).toBeTruthy();
  });

  it(`should set pageTitle correctly`, () => {
    fixture.detectChanges();

    expect(app.pageTitle).toEqual('Gaming Legend');
  });
});
