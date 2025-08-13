import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthorizationService } from '../services/authorization.service';

export const authorizationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const authorizationService = inject(AuthorizationService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authorizationService.hasRoleAdmin(authService.sessionToken))
    return true;

  router.navigate(['/login']);
  return false;
};
