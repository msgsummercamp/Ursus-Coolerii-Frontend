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
import { UserListRolePipe } from '../../shared/user-list-role.pipe';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { User } from '../../shared/types/types';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';

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
    MatPaginator,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
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

  private deleteUser(userId: string) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.userService.fetchUsers();
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
