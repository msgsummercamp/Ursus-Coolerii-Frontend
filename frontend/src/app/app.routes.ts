import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { ConfirmationEligibilityComponent } from './core/confirmation-eligibility/confirmation-eligibility.component';

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
    path: 'confirmation',
    component: ConfirmationEligibilityComponent,
  },
  {
    path: 'cases',
    loadComponent: () =>
      import('./core/case-list/case-list.component').then((m) => m.CaseListComponent),
  },
  { path: '**', component: NotFoundComponent },
];
