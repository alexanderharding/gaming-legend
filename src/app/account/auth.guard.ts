import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private readonly authService: AuthService) {}
  canLoad(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map((user) => (user ? true : false))
    );
  }
}
