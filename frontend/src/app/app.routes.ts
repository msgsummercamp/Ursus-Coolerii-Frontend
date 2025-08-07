import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { ConfirmationEligibilityComponent } from './core/confirmation-eligibility/confirmation-eligibility.component';

export const routes: Routes = [
  { path: '', redirectTo: '/form', pathMatch: 'full' },
  {
    path: 'form',
    loadComponent: () =>
      import('./core/stepper/component/stepper.component').then((m) => m.StepperComponent),
  },
  { path: 'confirmation', component: ConfirmationEligibilityComponent },
  { path: '**', component: NotFoundComponent },
];
