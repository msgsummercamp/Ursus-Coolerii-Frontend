import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../types/types';
import { map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly API_URL = environment.apiURL;

  public isAuthenticated(): Observable<boolean> {
    const subject = new Subject<boolean>();
    this.http
      .get<{ status: boolean }>(this.API_URL + '/auth/check', {
        withCredentials: true,
      })
      .pipe(map((response) => response.status))
      .subscribe({
        next: (res) => {
          subject.next(true);
        },
        error: (error) => {
          subject.next(false);
        },
      });
    return subject.asObservable();
  }

  public login(email: string, password: string) {
    const request: LoginRequest = {
      email: email,
      password: password,
    };

    return this.http.post<LoginResponse>(this.API_URL + '/auth/login', request, {
      withCredentials: true,
    });
  }

  public logout() {
    this.cookieService.delete('token');
  }

  public getToken() {
    return this.cookieService.get('token');
  }
}
