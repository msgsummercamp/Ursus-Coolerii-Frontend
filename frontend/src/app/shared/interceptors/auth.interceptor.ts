import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import {environment} from "../../core/environments/environment";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authUrl = environment.apiURL + "/auth";
  const skipUrls = [authUrl];
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (skipUrls.includes(req.url) || token === null) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      Authorization: 'Bearer Token: ' + token,
    },
  });

  return next(cloned);
};
