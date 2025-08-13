import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../types/types';
import { BehaviorSubject, catchError, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly API_URL = environment.apiURL;
  private loggedIn = new BehaviorSubject<boolean>(false);
  public loggedIn$ = this.loggedIn.asObservable();
  public loggedInSignal: Signal<boolean> = toSignal(this.loggedIn$, { initialValue: false });

  public get sessionToken(): string {
    return this.cookieService.get('jwt');
  }

  public isAuthenticated(): boolean {
    return this.isTokenValid(this.sessionToken);
  }

  public isTokenValid(token: string): boolean {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      if (!expiry) return false;

      const now = Math.floor(Date.now() / 1000);
      return expiry > now;
    } catch (e) {
      return false;
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
          this.loggedIn.next(true);
          return response.token;
        }),
        catchError((error) => {
          this.loggedIn.next(false);
          return '';
        })
      );
  }

  public logout() {
    this.cookieService.delete('jwt');
    this.loggedIn.next(false);
  }

  /*  public get jwtToken(): Observable<string> {
    return this.token.asObservable();
  }*/
}
