import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../shared/services/auth.service';
import { AuthorizationService } from '../../shared/services/authorization.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [MatCard, MatCardHeader, MatCardContent, MatIcon, TranslocoDirective, MatButton],
})
export class HomePageComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private authorizationService: AuthorizationService
  ) {}

  public goToForm() {
    this.router.navigate(['/form']);
  }

  public goToCases() {
    const token = this.authService.sessionToken;
    if (this.authorizationService.hasRoleEmployee(token)) {
      this.router.navigate(['/cases']);
    } else if (this.authorizationService.hasRolePassenger(token)) {
      this.router.navigate(['/cases'], { queryParams: { myCases: true } });
    } else {
      console.log('No access to cases');
    }
  }
}
