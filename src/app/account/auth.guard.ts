import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor() // private readonly authService: AuthService,
  // private readonly router: Router
  {}

  canActivate(): boolean {
    return true;
  }

  canLoad(): boolean {
    return true;
  }

  // canActivate(): Observable<boolean> {
  //   return this.authService.currentUser$.pipe(
  //     map((user) => {
  //       if (user) {
  //         return true;
  //       }
  //       this.router.navigate(['/user']);
  //       return false;
  //     })
  //   );
  // }

  // canLoad(): Observable<boolean> {
  //   return this.authService.currentUser$.pipe(
  //     first(),
  //     map((user) => (user ? true : false))
  //   );
  // }
}
