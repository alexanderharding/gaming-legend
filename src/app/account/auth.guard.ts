import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map((user) => {
        if (user) {
          return true;
        }
        this.router.navigate(['/user']);
        return false;
      })
    );
  }

  canLoad(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      first(),
      map((user) => (user ? true : false))
    );
  }
}
