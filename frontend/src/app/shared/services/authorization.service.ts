import { Injectable } from '@angular/core';
import { Roles } from '../enums';
import { UserRole } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  public hasRoleAdmin(roles: UserRole[]): boolean {
    return roles.some((role) => role.name === Roles.admin);
  }
}
