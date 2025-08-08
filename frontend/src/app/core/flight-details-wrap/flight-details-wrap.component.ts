import { Component, computed, inject, output, signal, viewChildren } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { FlightDetailsFormComponent } from '../flight-details-form/component/flight-details-form.component';
import { NgForOf } from '@angular/common';
import { FlightDetailsForm } from '../../shared/types/form.types';
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
import { LoadingSpinnerComponent } from '../loading-spinner/component/loading-spinner.component';
import { StopoverService } from '../../shared/services/stopover.service';
import { AirportAttributes } from '../../shared/types/types';

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
export class FlightDetailsWrapComponent {
  private stopoverService = inject(StopoverService);
  private fb = inject(NonNullableFormBuilder);

  private flightFormComponents = viewChildren(FlightDetailsFormComponent);

  protected readonly next = output<void>();
  protected readonly previous = output<void>();

  protected isLoading = signal(false);

  public validForms = computed(() =>
    this.flightFormComponents()
      .map((form) => form.isValid())
      .every((value) => value)
  );

  protected connectingFlights = computed(() => {
    const airports = [
      this.stopoverService.stopoverState().departureAirport,
      ...this.stopoverService.stopoverState().stopovers,
      this.stopoverService.stopoverState().destinationAirport,
    ];

    const forms: FormGroup<FlightDetailsForm>[] = [];

    for (let i = 0; i < airports.length - 1; i += 1) {
      let currentAirport = airports[i];
      let nextAirport = airports[i + 1];
      let newForm = this.createForm(currentAirport, nextAirport);
      forms.push(newForm);
    }

    return forms;
  });

  protected continue() {
    this.next.emit();
  }
  protected back() {
    this.previous.emit();
  }

  private createForm(
    departingAirport: AirportAttributes,
    destinationAirport: AirportAttributes
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
