import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../types/types';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
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

  constructor() {
    this.loggedIn.next(this.isAuthenticated());
  }

  public get sessionToken(): string {
    return this.cookieService.get('jwt');
  }

  public isAuthenticated(): boolean {
    return this.isTokenValid(this.sessionToken);
  }

  public get getEmail(): string | undefined {
    return this.extractEmailFromToken(this.sessionToken);
  }

  public get getFirstName(): string | undefined {
    return this.extractFirstNameFromToken(this.sessionToken);
  }

  public get getLastName(): string | undefined {
    return this.extractLastNameFromToken(this.sessionToken);
  }

  public get getId(): string | undefined {
    return this.extractIdFromToken(this.sessionToken);
  }

  private extractIdFromToken(token: string): string | undefined {
    if (!token) return undefined;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return undefined;
    }
  }

  private extractFirstNameFromToken(token: string): string | undefined {
    if (!token) return undefined;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.firstName;
    } catch {
      return undefined;
    }
  }

  private extractLastNameFromToken(token: string): string | undefined {
    if (!token) return undefined;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.lastName;
    } catch {
      return undefined;
    }
  }

  private extractEmailFromToken(token: string): string | undefined {
    if (!token) return undefined;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return undefined;
    }
  }

  public isTokenValid(token: string): boolean {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      if (!expiry) {
        this.cookieService.delete('jwt');
        return false;
      }

      const now = Math.floor(Date.now() / 1000);
      if (expiry <= now) this.cookieService.delete('jwt');

      return expiry > now;
    } catch (e) {
      this.cookieService.delete('jwt');
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
          return response.token !== '';
        }),

        catchError((error: HttpErrorResponse) => {
          this.loggedIn.next(false);
          return throwError(() => error);
        })
      );
  }

  public logout() {
    this.cookieService.delete('jwt');
    this.loggedIn.next(false);
  }
}
