import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { LanguageSwitcherComponent } from '../../../../language-switcher/components/language-switcher.component';
import { RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../../shared/services/auth.service';
import { AuthDirectiveLogin } from '../../../../shared/directives/auth.login.directive';
import { AuthLogoutDirective } from '../../../../shared/directives/auth-logout.directive';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  imports: [
    MatToolbar,
    LanguageSwitcherComponent,
    RouterLink,
    MatIconButton,
    MatIcon,
    AuthDirectiveLogin,
    AuthLogoutDirective,
  ],
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
export class ToolbarComponent {
  private authService = inject(AuthService);

  public logout() {
    this.authService.logout();
  }
}
