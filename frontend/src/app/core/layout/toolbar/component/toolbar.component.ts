import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { LanguageSwitcherComponent } from '../../../../language-switcher/components/language-switcher.component';
import { RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  imports: [
    MatToolbar,
    LanguageSwitcherComponent,
    RouterLink,
    MatIconButton,
    MatIcon,
    NgOptimizedImage,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {}
