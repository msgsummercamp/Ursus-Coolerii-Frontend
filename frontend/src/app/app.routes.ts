import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { FlightDetailsWrapComponent } from './core/layout/flight-details-wrap/flight-details-wrap.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./core/home-page/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'form',
    loadComponent: () =>
      import('./core/stepper/component/stepper.component').then((m) => m.StepperComponent),
  },
  {
    path: 'cases',
    loadComponent: () =>
      import('./core/case-list/case-list.component').then((m) => m.CaseListComponent),
  },
  { path: '**', component: NotFoundComponent },
];
