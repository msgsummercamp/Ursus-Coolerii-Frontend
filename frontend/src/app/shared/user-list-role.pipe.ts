import { Pipe, PipeTransform } from '@angular/core';
import { Role } from './types/types';

@Pipe({
  name: 'transform',
})
export class UserListRolePipe implements PipeTransform {
  transform(roles: Role[]): string {
    return roles.map((role) => role.name).join(', ');
  }
}
