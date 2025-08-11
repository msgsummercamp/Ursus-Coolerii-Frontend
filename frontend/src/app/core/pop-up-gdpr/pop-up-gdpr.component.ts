import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-pop-up-gdpr',
  imports: [
    MatDialogActions,
    MatDialogContent,
    ReactiveFormsModule,
    MatButton,
    MatDialogClose,
    TranslocoPipe,
  ],
  templateUrl: './pop-up-gdpr.component.html',
  styleUrl: './pop-up-gdpr.component.scss',
})
export class PopUpGdprComponent {}
