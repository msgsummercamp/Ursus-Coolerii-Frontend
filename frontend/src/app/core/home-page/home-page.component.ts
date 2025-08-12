import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [MatButton, TranslocoPipe],
})
export class HomePageComponent {
  constructor(private router: Router) {}

  goToForm() {
    this.router.navigate(['/form']);
  }
}
