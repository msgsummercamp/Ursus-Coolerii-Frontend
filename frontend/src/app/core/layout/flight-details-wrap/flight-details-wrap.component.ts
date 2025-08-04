import { Component, computed, OnInit } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { output, inject } from '@angular/core';
import {AirportService} from '../flight-details-form/service/airport.service';
import { MatButtonModule } from '@angular/material/button';
import { FlightDetailsFormComponent } from '../flight-details-form/component/flight-details-form.component';
import { signal } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FlightDetailsForm } from '../../../shared/types/form.types';

@Component({
  selector: 'app-flight-details-wrap',
  imports: [TranslocoPipe, MatButtonModule, FlightDetailsFormComponent, NgForOf, NgIf],
  templateUrl: './flight-details-wrap.component.html',
  styleUrl: './flight-details-wrap.component.scss',
})
export class FlightDetailsWrapComponent implements OnInit {
  public readonly next = output<void>();
  private airportService = inject(AirportService);
  private _isValid = signal(false);
  private subscriptions: Subscription[] = [];

  protected continue() {
    this.next.emit();
  }

  ///TODO : unsubscribes
  ngOnInit() : void {
    this.subscribeToForms();
  }

  private subscribeToForms() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.subscribeToNewForm(this.form);
    this.connectingFlights.forEach((f) => {
      this.subscribeToNewForm(f);
    });
    this.updateValidity();

  }
  private updateValidity() {
    const allValid = this.form.valid && this.connectingFlights.every((f) => f.valid);
    this._isValid.set(allValid);
  }

  public form = this.airportService.createForm();
  public connectingFlights: FormGroup<FlightDetailsForm>[] = [];

  public validForms = computed(() => this._isValid());

  private subscribeToNewForm(formToSub: FormGroup<FlightDetailsForm>): void {
    this.subscriptions.push(formToSub.statusChanges.subscribe(() => this.updateValidity()));
  }

  public addConnectingFlight() {
    if (!this.validForms()) return;

    const newForm = this.airportService.createForm();
    this.subscribeToNewForm(newForm);
    this.connectingFlights.push(newForm);
  }

  public removeConnectingFlight() {
    if (this.connectingFlights.length === 0) return;
    this.subscriptions.pop()?.unsubscribe();
    this.connectingFlights.pop();
    this.updateValidity();
  }
}
