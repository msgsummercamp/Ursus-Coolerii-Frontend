import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const routeName = route.routeConfig?.path;
  return authService.isAuthenticated().pipe(
    tap((isAuth) => {
      if (!isAuth && routeName === 'form') {
        router.navigate(['/login']);
      }
      if (isAuth && routeName === 'login') {
        router.navigate(['/home']);
      }
    }),
    map((isAuth) => {
      if (!isAuth && routeName === 'form') return false;
      if (isAuth && routeName === 'login') return false;
      return true;
    })
  );
};
