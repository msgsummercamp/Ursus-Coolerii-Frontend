import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import {FlightDetailsFormComponent} from "./core/layout/flight-details-form/component/flight-details-form.component";

export const routes: Routes = [
  { path: '', redirectTo: '/form', pathMatch: 'full' },
  {
    path: 'form',
    loadComponent: () =>
      import('./core/layout/flight-details-form/component/flight-details-form.component').then((m) => m.FlightDetailsFormComponent),
  },
  { path: '**', component: NotFoundComponent },
];
