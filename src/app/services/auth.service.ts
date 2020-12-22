import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, retry } from 'rxjs/operators';
import { IUser, User } from '../types/user';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = 'http://localhost:3000';
  // private currentUserSubject: BehaviorSubject<IUser>;
  // currentUser$: Observable<IUser>;

  private readonly currentUserSubject = new BehaviorSubject<IUser>(
    JSON.parse(localStorage.getItem('currentUser'))
  );
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly errorService: ErrorService
  ) {
    // this.currentUserSubject = new BehaviorSubject<IUser>(
    //   JSON.parse(localStorage.getItem('currentUser'))
    // );
    // this.currentUser$ = this.currentUserSubject.asObservable();
  }

  signIn(email: string, password: string): Observable<boolean> {
    const userEmail = email.trim().toLowerCase();
    return this.http
      .get<IUser[]>(`${this.baseUrl}/users/?email=${userEmail}`)
      .pipe(
        delay(1000),
        retry(3),
        map((users) => {
          const firstUserFound = users[0];
          console.log(`Found user!: ${JSON.stringify(firstUserFound)}`);
          if (!firstUserFound) {
            return false;
          }
          if (
            userEmail === firstUserFound.email.toLowerCase() &&
            password === firstUserFound.password
          ) {
            localStorage.setItem('currentUser', JSON.stringify(firstUserFound));
            this.currentUserSubject.next(firstUserFound);
            console.log(`Signed in!`);
            return true;
          } else {
            return false;
          }
        }),
        catchError(this.errorService.handleError)
      );
  }

  signOut(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  checkForUser(email: string): Observable<boolean> {
    return this.http.get<IUser[]>(`${this.baseUrl}/users/?email=${email}`).pipe(
      delay(1000),
      retry(3),
      map((users) => {
        const firstUserFound = users[0];
        return firstUserFound ? true : false;
      }),
      catchError(this.errorService.handleError)
    );
  }

  saveUser(user: User): Observable<IUser> {
    return user.id ? this.updateUser(user as IUser) : this.addUser(user);
  }

  private addUser(user: User): Observable<IUser> {
    return this.http
      .post<IUser>(`${this.baseUrl}/users`, user)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  private updateUser(user: IUser): Observable<IUser> {
    console.log(`Updating user: ${user.id}`);
    return this.http
      .put<IUser>(`${this.baseUrl}/user/${+user.id}`, user)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }

  signUp(user: User): Observable<IUser> {
    return this.http
      .post<IUser>(`${this.baseUrl}/users`, user)
      .pipe(delay(1000), retry(3), catchError(this.errorService.handleError));
  }
}
