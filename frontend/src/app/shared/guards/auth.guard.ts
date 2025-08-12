import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subject } from 'rxjs';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const routeName = route.routeConfig?.path;
  authService.isAuthenticated();
  const isAuthenticated = authService.isAuthenticated();
  const subject = new Subject<boolean>();
  isAuthenticated.subscribe((res) => {
    if (!res && routeName !== 'login') {
      router.navigate(['/login']);
    }
    if (res && routeName === 'login') {
      router.navigate(['/home']);
    }
    subject.next(res);
  });

  return true;
};
