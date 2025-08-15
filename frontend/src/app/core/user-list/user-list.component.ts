import { Component, inject, OnInit } from '@angular/core';
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
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { User } from '../../shared/types/types';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, TitleCasePipe } from '@angular/common';
import { UserListRolePipe } from '../../shared/user-list-role.pipe';
import { MatCard } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  imports: [
    MatTable,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    TranslocoPipe,
    MatIcon,
    MatPaginator,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatButton,
    FormsModule,
    NgForOf,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatIconButton,
    MatHeaderCellDef,
    MatCellDef,
    UserListRolePipe,
    NgClass,
    MatCard,
    MatChip,
    TitleCasePipe,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private readonly snackBar = inject(MatSnackBar);

  viewMode: 'grid' | 'table' = 'grid';
  roleList = ['ADMIN', 'PASSENGER', 'EMPLOYEE'];
  selectedRole: string | null = null;
  casesCountFilter: number | null = null;

  protected displayedColumns: string[] = [
    'actions',
    'firstName',
    'lastName',
    'email',
    'role',
    'casesCount',
  ];

  private readonly dialog = inject(MatDialog);

  constructor(protected userService: UserService) {}

  get users(): User[] {
    return this.userService.usersSignal();
  }

  ngOnInit() {
    this.userService.fetchUsers();
  }

  onPageChange(event: PageEvent) {
    this.userService.fetchUsers(event.pageIndex, event.pageSize);
  }

  public filteredUsers(): User[] {
    return this.users.filter((u) => {
      const roleMatches =
        !this.selectedRole || u.role.some((role) => role.name === this.selectedRole);
      const casesMatches = this.casesCountFilter == null || u.casesCount === this.casesCountFilter;
      return roleMatches && casesMatches;
    });
  }

  public clearFilters() {
    this.selectedRole = null;
    this.casesCountFilter = null;
  }

  roleClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'role-admin';
      case 'employee':
        return 'role-employee';
      case 'passenger':
        return 'role-passenger';
      default:
        return '';
    }
  }

  private deleteUser(userId: string) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.userService.fetchUsers();
      this.snackBar.open('User deleted successfully', 'Close', {
        duration: 3000,
      });
    });
  }

  protected openDialog(userId: string) {
    let dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteUser(userId);
      }
    });
  }
}
