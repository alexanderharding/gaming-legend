import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';

/* Components */
import { AppComponent } from './app.component';

/* Guards */
import { AuthGuard } from './account/auth.guard';
import { UserGuard } from './user/user.guard';
import { NotificationsContainerComponent } from './notifications-container/notifications-container.component';
import { CoreModule } from './core/core.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    CoreModule,
    AppRoutingModule,
  ],
  declarations: [AppComponent, NotificationsContainerComponent],
  providers: [AuthGuard, UserGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
