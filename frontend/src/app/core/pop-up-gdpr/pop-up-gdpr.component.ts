import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-pop-up-gdpr',
  imports: [MatDialogActions, MatDialogContent, ReactiveFormsModule, MatButton, MatDialogClose],
  templateUrl: './pop-up-gdpr.component.html',
  styleUrl: './pop-up-gdpr.component.scss',
})
export class PopUpGdprComponent {}
