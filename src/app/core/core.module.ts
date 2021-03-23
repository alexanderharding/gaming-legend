import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../services/cart.service';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule],
  exports: [NavbarComponent, WelcomeComponent],
  declarations: [NavbarComponent, WelcomeComponent],
  providers: [CartService],
})
export class CoreModule {}
