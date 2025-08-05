import { Component, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  imports: [MatProgressSpinner],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
})
export class LoadingSpinnerComponent {
  protected readonly hideSpinner = signal(true);

  constructor() {
    setTimeout(() => {
      this.hideSpinner.set(false);
    }, 300);
  }

  public stopSpinner() {
    this.hideSpinner.set(true);
  }
}
