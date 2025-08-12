import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, UserRole } from '../types/types';
import { BehaviorSubject, catchError, map, Observable, of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly API_URL = environment.apiURL;
  private subjectRoles$ = new BehaviorSubject<UserRole[] | undefined>([]);

  public isAuthenticated(): Observable<boolean> {
    return this.http
      .get<{ loggedIn: boolean }>(this.API_URL + '/auth/check', {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          return response.loggedIn;
        }),
        catchError((error) => {
          return of(false);
        })
      );
  }

  public me() {
    return this.http
      .get<{ roles: UserRole[] }>(this.API_URL + '/auth/me', {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          return response.roles;
        }),
        catchError((error) => {
          return of(undefined);
        })
      );
  }

  public getRoles(): Observable<UserRole[] | undefined> {
    if (this.subjectRoles$.getValue()?.length === 0) {
      return this.me().pipe(
        map((response) => {
          this.subjectRoles$.next(response);
          return response;
        })
      );
    } else {
      return this.subjectRoles$.asObservable();
    }
  }

  public login(email: string, password: string) {
    const request: LoginRequest = {
      email: email,
      password: password,
    };

    return this.http
      .post<LoginResponse>(this.API_URL + '/auth/login', request, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          return response;
        }),
        shareReplay(2)
      );
  }

  public logout() {
    this.cookieService.delete('token');
  }

  /*  public get jwtToken(): Observable<string> {
    return this.token.asObservable();
  }*/
}
