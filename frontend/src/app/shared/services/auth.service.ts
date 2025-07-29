import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import {environment} from "../../../environments/environment";

type ResponseType = {
  token: string;
  user: {
    id: number;
    role: string;
  };
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _isLoggedIn = signal(false);

  public readonly isLoggedIn = this._isLoggedIn.asReadonly();

  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly API_URL = environment.apiURL;

  constructor() {
    if (this.cookieService.get('token') != '') {
      this._isLoggedIn.set(true);
      this.router.navigate(['/form']);
    }
  }

  public login(username: string, password: string) {
    this.http
      .post<ResponseType>(this.API_URL + '/auth/login', { username, password })
      .subscribe({
        next: (response) => {
          this.cookieService.set('token', response.token);
          this._isLoggedIn.set(true);
          this.router.navigate(['/form']);
        },
      });
  }

  public logout() {
    this.cookieService.delete('token');
    this._isLoggedIn.set(false);
  }

  public getToken() {
    return this.cookieService.get('token');
  }
}
