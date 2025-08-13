import { Injectable } from '@angular/core';
import { Roles } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private getAuthoritiesFromToken(token: string): string[] {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.authorities || [];
    } catch {
      return [];
    }
  }
  public hasRoleAdmin(token: string): boolean {
    const roles = this.getAuthoritiesFromToken(token);
    return roles.some((role) => role === Roles.admin);
  }
}
