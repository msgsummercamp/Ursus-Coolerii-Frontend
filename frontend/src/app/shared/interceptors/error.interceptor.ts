import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpInterceptorFn) => {
      console.error('Error: ', error);
      throw error;
    }),
  );
};
