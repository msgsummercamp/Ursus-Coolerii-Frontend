import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { FlightDetailsFormComponent } from '../flight-details-form/component/flight-details-form.component';
import { NgForOf } from '@angular/common';
import { FlightDetailsForm, ReservationDetailsForm } from '../../shared/types/form.types';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoadingSpinnerComponent } from '../loading-spinner/component/loading-spinner.component';
import { StopoverService } from '../../shared/services/stopover.service';

@Component({
  selector: 'app-flight-details-wrap',
  imports: [
    TranslocoPipe,
    MatButtonModule,
    FlightDetailsFormComponent,
    NgForOf,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    LoadingSpinnerComponent,
    LoadingSpinnerComponent,
    FlightDetailsFormComponent,
    FlightDetailsFormComponent,
    FlightDetailsFormComponent,
    FlightDetailsFormComponent,
    ReactiveFormsModule,
    MatCardActions,
    TranslocoDirective,
  ],
  templateUrl: './flight-details-wrap.component.html',
  styleUrl: './flight-details-wrap.component.scss',
})
export class FlightDetailsWrapComponent implements OnInit {
  private stopoverService = inject(StopoverService);

  private fb = inject(NonNullableFormBuilder);
  private subscriptions: Subscription[] = [];

  protected readonly next = output<void>();
  protected readonly previous = output<void>();
  protected isLoading = signal(false);

  protected _isValid = signal(false);

  protected connectingFlights = computed(() => {
    const stopovers = this.stopoverService.stopoverState().stopovers;

    const forms: FormGroup<FlightDetailsForm>[] = [];

    stopovers.forEach((airport) => {
      let newForm = this.createForm(airport.name, airport.name);
      forms.push(newForm);
    });
    return forms;
  });

  public validForms = computed(() => this._isValid());

  protected continue() {
    this.next.emit();
  }
  protected back() {
    this.previous.emit();
  }

  constructor() {
    this.connectingFlights().forEach((form) => {
      this.subscribeToNewForm(form);
      this.subscribeToForms();
    });
  }

  ///TODO : unsubscribes
  ngOnInit(): void {
    this.subscribeToForms();
  }

  private subscribeToForms() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.connectingFlights().forEach((f) => {
      this.subscribeToNewForm(f);
    });
    this.updateValidity();
  }

  private updateValidity() {
    let allValid: boolean;
    if (this.connectingFlights.length < 1) {
      allValid = false;
    } else {
      allValid = this.connectingFlights().every((f) => f.valid);
    }
    this._isValid.set(allValid);
  }

  private subscribeToNewForm(
    formToSub: FormGroup<FlightDetailsForm> | FormGroup<ReservationDetailsForm>
  ): void {
    this.subscriptions.push(formToSub.statusChanges.subscribe(() => this.updateValidity()));
  }

  private createForm(
    departingAirport: string,
    destinationAirport: string
  ): FormGroup<FlightDetailsForm> {
    return this.fb.group<FlightDetailsForm>(
      {
        flightNr: this.fb.control('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z]{2}[0-9]{1,4}$'),
        ]),
        airline: this.fb.control('', Validators.required),
        departingAirport: this.fb.control(departingAirport),
        destinationAirport: this.fb.control(destinationAirport),
        plannedDepartureDate: this.fb.control(null, Validators.required),
        plannedArrivalDate: this.fb.control(null, Validators.required),
        plannedDepartureTime: this.fb.control('', Validators.required),
        plannedArrivalTime: this.fb.control('', Validators.required),
      },
      { validators: this.departureBeforeArrivalValidator() }
    );
  }

  private departureBeforeArrivalValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const actualGroup = group as FormGroup<FlightDetailsForm>;

      const depDate = actualGroup.controls.plannedDepartureDate.value;
      const arrDate = actualGroup.controls.plannedArrivalDate.value;
      const depTime = actualGroup.controls.plannedDepartureTime.value;
      const arrTime = actualGroup.controls.plannedArrivalTime.value;
      const depDateStr = depDate?.toISOString().split('T')[0];
      const arrDateStr = arrDate?.toISOString().split('T')[0];

      if (depDateStr === arrDateStr) {
        const [depHour, depMin] = depTime.split(':').map(Number);
        const [arrHour, arrMin] = arrTime.split(':').map(Number);
        const depTotal = depHour * 60 + depMin;
        const arrTotal = arrHour * 60 + arrMin;

        if (depTotal >= arrTotal) {
          return { departureAfterArrival: true };
        }
      }
      return null;
    };
  }
}
