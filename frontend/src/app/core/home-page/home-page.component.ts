import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
    MatIcon,
    TranslocoPipe,
    TranslocoDirective,
    MatButton,
  ],
})
export class HomePageComponent {
  constructor(private router: Router) {}

  goToForm() {
    this.router.navigate(['/form']);
  }
}
