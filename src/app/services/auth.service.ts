import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { IUser, User } from '../types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = 'http://localhost:3000';
  private currentUserSubject: BehaviorSubject<IUser>;
  currentUser$: Observable<IUser>;

  constructor(private readonly http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<IUser>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  signIn(email: string, password: string): Observable<boolean> {
    const userEmail = email.trim().toLowerCase();
    return this.http
      .get<IUser[]>(`${this.baseUrl}/users/?email=${userEmail}`)
      .pipe(
        delay(1000),
        map((users) => {
          const firstUserFound = users[0];
          console.log(`Found user!: ${JSON.stringify(firstUserFound)}`);
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
        catchError(this.handleError)
      );
  }

  signOut(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  signUp(user: User): Observable<IUser> {
    return this.http
      .post<IUser>(`${this.baseUrl}/users`, user)
      .pipe(delay(1000), catchError(this.handleError));
  }

  checkForUser(email: string): Observable<boolean> {
    return this.http.get<IUser[]>(`${this.baseUrl}/users/?email=${email}`).pipe(
      delay(1000),
      map((users) => {
        const firstUserFound = users[0];
        return firstUserFound ? true : false;
      }),
      catchError((err) => of(false))
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
