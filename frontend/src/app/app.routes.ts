import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { UserDetailsComponent } from './core/user-details/user-details.component';


export const routes: Routes = [
  { path: '', redirectTo: '/form', pathMatch: 'full' },
  {
    path: 'form',
    loadComponent: () =>
      import('./core/stepper/component/stepper.component').then((m) => m.StepperComponent),
  },
  {path: 'user-details', component: UserDetailsComponent},
  { path: '**', component: NotFoundComponent },
];
