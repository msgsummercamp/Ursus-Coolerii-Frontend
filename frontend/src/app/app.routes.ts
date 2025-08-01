import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import {FlightDetailsFormComponent} from "./core/layout/flight-details-form/component/flight-details-form.component";
import { DocumentsFormComponent } from './core/documents-form/documents-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/form', pathMatch: 'full' },
  {
    path: 'form',
    loadComponent: () =>
      import('./core/stepper/component/stepper.component').then((m) => m.StepperComponent),
  },
    {
    path: 'documents', component: DocumentsFormComponent
  },
  { path: '**', component: NotFoundComponent },
];
