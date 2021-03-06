import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from './cart.service';
import { WelcomeComponent } from './welcome/welcome.component';
import { FooterComponent } from './footer/footer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotificationsContainerComponent } from './notifications-container/notifications-container.component';
import { ErrorService } from './error.service';
import { NotificationService } from './notification.service';

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule],
  exports: [
    NavbarComponent,
    WelcomeComponent,
    FooterComponent,
    NotFoundComponent,
    NotificationsContainerComponent,
  ],
  declarations: [
    NavbarComponent,
    WelcomeComponent,
    FooterComponent,
    NotFoundComponent,
    NotificationsContainerComponent,
  ],
  providers: [CartService, ErrorService, NotificationService],
})
export class CoreModule {}
