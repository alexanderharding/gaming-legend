import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserResult } from '../types/user-result';

@Injectable({ providedIn: 'root' })
export class UserResolverService implements Resolve<UserResult> {
  constructor(private readonly authService: AuthService) {}
  resolve(): Observable<UserResult> {
    return this.authService.currentUser$.pipe(
      first(),
      map((user) => ({ user } as UserResult))
    );
  }
}
