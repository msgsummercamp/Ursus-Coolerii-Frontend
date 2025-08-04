import { Component, computed, effect, OnInit, Signal, viewChild } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { output, inject } from '@angular/core';
import { AirportService } from '../flight-details-form/service/airport.service';
import { MatButtonModule } from '@angular/material/button';
import { FlightDetailsFormComponent } from '../flight-details-form/component/flight-details-form.component';
import { signal } from '@angular/core';
import { NgForOf } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { FlightDetailsForm } from '../../../shared/types';
import { Subscription } from 'rxjs';
import { CaseFileService } from '../services/case-file.service';

@Component({
  selector: 'app-flight-details-wrap',
  imports: [TranslocoPipe, MatButtonModule, FlightDetailsFormComponent, NgForOf],
  templateUrl: './flight-details-wrap.component.html',
  styleUrl: './flight-details-wrap.component.scss',
})
export class FlightDetailsWrapComponent implements OnInit {
  public readonly next = output<void>();
  private airportService = inject(AirportService);
  private _isValid = signal(false);
  private subscriptions: Subscription[] = [];
  reward: number | null = null;
  private caseFileService = inject(CaseFileService);

  protected continue() {
    this.next.emit();
  }

  ///TODO : unsubscribes
  ngOnInit(): void {
    this.subscribeToForms();
    this.form.statusChanges.subscribe(() => this.checkAndFetchReward());

    this.connectingFlights.forEach((f) =>
      f.statusChanges.subscribe(() => this.checkAndFetchReward())
    );
  }

  private checkAndFetchReward() {
    if (this.validForms()) {
      const caseFile = this.buildCaseFileFromForms();
      this.caseFileService.calculateReward(caseFile).subscribe((reward) => {
        this.reward = reward;
      });
    } else {
      this.reward = null;
    }
  }

  private buildCaseFileFromForms() {
    const allFlightForms = [this.form, ...this.connectingFlights];

    const airports: FormGroup<FlightDetailsForm>[] = allFlightForms.filter(
      (f, index) => index === 0 || index === allFlightForms.length - 1
    );
    console.log(airports[airports.length - 1].controls.destinationAirport.value);
    return {
      departureAirport: airports[0].controls.departingAirport.value,
      destinationAirport: airports[airports.length - 1].controls.destinationAirport.value,
    };
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
    newForm.statusChanges.subscribe(() => this.checkAndFetchReward());
    this.connectingFlights.push(newForm);
  }

  public removeConnectingFlight() {
    if (this.connectingFlights.length === 0) return;
    this.subscriptions.pop()?.unsubscribe();
    this.connectingFlights.pop();
  }
}
