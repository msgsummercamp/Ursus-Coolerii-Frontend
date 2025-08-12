import { Component, OnInit } from '@angular/core';
import { UserService } from './service/user.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { UserListRolePipe } from '../../shared/user-list-role.pipe';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { User } from '../../shared/types/types';

@Component({
  selector: 'app-user-list',
  imports: [
    MatTable,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    TranslocoPipe,
    MatIcon,
    MatIconButton,
    RouterLink,
    UserListRolePipe,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = [
    'userId',
    'firstName',
    'lastName',
    'email',
    'role',
    'casesCount',
    'delete',
    'edit',
  ];

  constructor(private userService: UserService) {
    console.log(this.userService.usersSignal());
  }

  get users(): User[] {
    return this.userService.usersSignal();
  }

  ngOnInit() {
    this.userService.fetchUsers();
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(() => {
      this.userService.fetchUsers();
    });
  }
}
