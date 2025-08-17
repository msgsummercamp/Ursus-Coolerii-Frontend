import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { LanguageSwitcherComponent } from '../../../../language-switcher/components/language-switcher.component';
import { RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../../shared/services/auth.service';
import { AuthDirectiveLogin } from '../../../../shared/directives/auth.login.directive';
import { AuthLogoutDirective } from '../../../../shared/directives/auth-logout.directive';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { MatLabel } from '@angular/material/input';
import { AdminDirective } from '../../../../shared/directives/admin.directive';

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
    MatTooltip,
    MatLabel,
    AdminDirective,
    TranslocoPipe,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  protected readonly translate = translate;

  public logout() {
    this.authService.logout();

    this.snackBar.open(this.translate('logout'), this.translate('close'), {
      duration: 3000,
    });
  }
}
