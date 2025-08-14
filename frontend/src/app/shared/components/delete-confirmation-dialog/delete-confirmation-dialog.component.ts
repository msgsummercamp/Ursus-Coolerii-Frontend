import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-delete-confirmation-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrl: './delete-confirmation-dialog.component.scss',
})
export class DeleteConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>) {}

  protected handleConfirmation() {
    this.dialogRef.close(true);
  }

  protected handleCancel() {
    this.dialogRef.close(false);
  }
}
