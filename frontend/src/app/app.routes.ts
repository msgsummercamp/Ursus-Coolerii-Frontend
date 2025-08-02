import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { FlightDetailsWrapComponent } from './core/layout/flight-details-wrap/flight-details-wrap.component';

export const routes: Routes = [
  { path: '', redirectTo: '/form', pathMatch: 'full' },
  {
    path: 'form',
    loadComponent: () =>
      import('./core/stepper/component/stepper.component').then((m) => m.StepperComponent),
  },
  { path: 'wrap', component: FlightDetailsWrapComponent },
  { path: '**', component: NotFoundComponent },
];
