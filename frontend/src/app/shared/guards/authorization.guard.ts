import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthorizationService } from '../services/authorization.service';
import { map } from 'rxjs';

export const authorizationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const authorizationService = inject(AuthorizationService);
  const router = inject(Router);
  const routeName = route.routeConfig?.path;

  return authService.getRoles().pipe(
    map((response) => {
      if (!response) return false;
      const isAdmin = authorizationService.hasRoleAdmin(response);
      if (!isAdmin) {
        router.navigate(['/home']);
      }
      return isAdmin;
    })
  );
};
