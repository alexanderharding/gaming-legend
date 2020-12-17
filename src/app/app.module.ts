import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';

/* Components */
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { AccountComponent } from './account/account.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    WelcomeComponent,
    NotFoundComponent,
    ConfirmModalComponent,
    AccountComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
