import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../services/cart.service';
import { WelcomeComponent } from './welcome/welcome.component';
import { FooterComponent } from './footer/footer.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule],
  exports: [
    NavbarComponent,
    WelcomeComponent,
    FooterComponent,
    NotFoundComponent,
  ],
  declarations: [
    NavbarComponent,
    WelcomeComponent,
    FooterComponent,
    NotFoundComponent,
  ],
  providers: [CartService],
})
export class CoreModule {}
