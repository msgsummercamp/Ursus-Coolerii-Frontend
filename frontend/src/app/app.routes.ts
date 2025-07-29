import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/form', pathMatch: 'full' },
  {
    path: 'form',
    loadComponent: () =>
      import('./core/layout/form/component/form.component').then((m) => m.FormComponent),
  },
  { path: '**', component: NotFoundComponent },
];
