import { Component, inject } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-pop-up-gdpr',
  imports: [MatDialogActions, MatDialogContent, MatCheckbox, ReactiveFormsModule, MatButton],
  templateUrl: './pop-up-gdpr.component.html',
  styleUrl: './pop-up-gdpr.component.scss',
})
export class PopUpGdprComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PopUpGdprComponent>);
  gdprForm: FormGroup;
  constructor() {
    this.gdprForm = this.fb.group({
      gdpr: [false, Validators.requiredTrue],
      terms: [false, Validators.requiredTrue],
      marketing: [false],
    });
  }

  submit() {
    this.dialogRef.close(this.gdprForm.value);
  }
}
