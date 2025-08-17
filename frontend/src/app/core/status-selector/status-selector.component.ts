import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CaseStatus } from '../../shared/enums';
import { NgClass, NgForOf } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-status-selector-dialog',
  templateUrl: './status-selector.component.html',
  styleUrl: './status-selector.component.scss',
  imports: [NgClass, NgForOf, TranslocoPipe, MatChip],
})
export class StatusSelectorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<StatusSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { statusOptions: CaseStatus[] }
  ) {}

  selectStatus(status: CaseStatus) {
    this.dialogRef.close(status);
  }
}
