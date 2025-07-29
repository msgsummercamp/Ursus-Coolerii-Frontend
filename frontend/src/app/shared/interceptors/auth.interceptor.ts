import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const skipUrls = ['https://dog.ceo/api/breeds/image/random'];
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
