import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { ConfirmationEligibilityComponent } from './core/confirmation-eligibility/confirmation-eligibility.component';
import { LoginComponent } from './core/login/login.component';
import { authGuard } from './shared/guards/auth.guard';

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
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard],
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
