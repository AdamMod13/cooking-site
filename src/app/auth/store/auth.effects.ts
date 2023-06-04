import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as AuthActions from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const handleAuthentication = (
  id: number,
  firstName: string,
  lastName: string,
  email: string
) => {
  console.log(new Date().getTime());
  const expirationDate = new Date(new Date().getTime() + 36000000);
  const user = new User(id, firstName, lastName, email, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    id: id,
    firstName: firstName,
    lastName: lastName,
    email: email,
    expirationDate: expirationDate,
    redirect: true,
  });
};

const handleError = (errorRes: any) => {
  if (typeof errorRes !== 'string') {
    return of(new AuthActions.AuthenticateFail('Login Failed'));
  }
  return of(new AuthActions.AuthenticateFail(errorRes));
};

@Injectable()
export class AuthEffects {
  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((authData: AuthActions.SignupStart) => {
        return this.http
          .post<AuthResponseData>(
            `http://localhost:8080/api/author/addAuthor`,
            {
              firstName: authData.payload.firstName,
              lastName: authData.payload.lastName,
              email: authData.payload.email,
            }
          )
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(3600000);
            }),
            map((resData) => {
              return handleAuthentication(
                resData.id,
                resData.firstName,
                resData.lastName,
                resData.email
              );
            }),
            catchError((errorRes) => {
              console.log(errorRes);
              return handleError(errorRes.error);
            })
          );
      })
    )
  );

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            `http://localhost:8080/api/author/sign-in/${authData.payload.email}`,
            null
          )
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(3600000);
            }),
            map((resData) => {
              return handleAuthentication(
                resData.id,
                resData.firstName,
                resData.lastName,
                resData.email
              );
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    )
  );

  authRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
          if (authSuccessAction.payload.redirect) {
            this.router.navigate(['/']);
          }
        })
      ),
    { dispatch: false }
  );

  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          id: number;
          firstName: string;
          lastName: string;
          email: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return { type: 'DUMMY' };
        }

        const loadedUser = new User(
          userData.id,
          userData.firstName,
          userData.lastName,
          userData.email,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.id) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return new AuthActions.AuthenticateSuccess({
            id: loadedUser.id,
            firstName: loadedUser.firstName,
            lastName: loadedUser.lastName,
            email: loadedUser.email,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false,
          });
        }
        return { type: 'DUMMY' };
      })
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
