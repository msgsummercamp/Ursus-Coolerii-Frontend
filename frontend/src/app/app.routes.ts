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
    path: 'cases',
    loadComponent: () =>
      import('./core/case-list/case-list.component').then((m) => m.CaseListComponent),
  },
  {
    path: 'cases/:contractId',
    loadComponent: () =>
      import('./core/case-details/case-details.component').then((m) => m.CaseDetailsComponent),
  },
  { path: 'confirmation', component: ConfirmationEligibilityComponent },
  { path: '**', component: NotFoundComponent },
];
