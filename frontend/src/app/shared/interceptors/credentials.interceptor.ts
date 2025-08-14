import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(AuthService);

  const token = service.sessionToken;

  const newReq = req.clone({
    // headers: req.headers.append('X-Authentication-Token', token),
    withCredentials: true,
  });

  return next(newReq);
};
