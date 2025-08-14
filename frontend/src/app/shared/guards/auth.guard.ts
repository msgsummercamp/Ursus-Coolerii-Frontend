import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const routeName = route.routeConfig?.path;
  const authenticated = authService.isAuthenticated();

  if (authenticated && routeName === 'login') {
    router.navigate(['/home']);
    return false;
  } else if (!authenticated && routeName !== 'login') {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
