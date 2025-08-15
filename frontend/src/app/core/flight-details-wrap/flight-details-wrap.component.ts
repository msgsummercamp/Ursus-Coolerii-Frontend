import {
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { FlightDetailsFormComponent } from '../flight-details-form/component/flight-details-form.component';
import { NgClass, NgForOf } from '@angular/common';
import { FlightDetailsForm } from '../../shared/types/form.types';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingSpinnerComponent } from '../loading-spinner/component/loading-spinner.component';
import { StopoverService } from '../../shared/services/stopover.service';
import { Flight } from '../../shared/types/types';
import { MatCheckbox } from '@angular/material/checkbox';
import { AirlineAttributes } from '../flight-details-form/service/airline.service';
import { MatIcon } from '@angular/material/icon';

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
    MatCheckbox,
    MatIcon,
    NgClass,
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

  @Output() receiveMessage = new EventEmitter<Flight>();

  public validForms = computed(
    () =>
      this.flightFormComponents()
        .map((form) => {
          return form.isValid();
        })
        .every((value) => value) && this.problemFlightIndex !== undefined
  );

  private existingForms = new Map<number, FormGroup<FlightDetailsForm>>();

  protected connectingFlights = computed(() => {
    const flights = this.stopoverService.stopoverState().flights;

    const forms: FormGroup<FlightDetailsForm>[] = [];

    for (let i = 0; i < flights.length; i += 1) {
      if (this.existingForms.has(i)) {
        const existingForm = this.existingForms.get(i)!;
        existingForm.patchValue({
          flightNr: flights[i].flightNumber || '',
          airline: flights[i].airlineName || '',
          departingAirport: flights[i].departureAirport.name,
          destinationAirport: flights[i].destinationAirport.name,
          plannedDepartureDate: flights[i].departureTime
            ? new Date(flights[i].departureTime)
            : null,
        });
        forms.push(existingForm);
      } else {
        const newForm = this.createForm(flights[i]);
        this.existingForms.set(i, newForm);
        forms.push(newForm);
      }
    }

    for (const [index] of this.existingForms) {
      if (index >= flights.length) {
        this.existingForms.delete(index);
      }
    }

    return forms;
  });

  protected getFlight(index: number) {
    return this.stopoverService.stopoverState().flights[index];
  }

  protected continue() {
    this.next.emit();
  }

  protected back() {
    this.previous.emit();
  }

  private createForm(flight: Flight): FormGroup<FlightDetailsForm> {
    const departureDate = flight.departureTime ? new Date(flight.departureTime) : null;
    return this.fb.group<FlightDetailsForm>({
      flightNr: this.fb.control(flight.flightNumber, [
        Validators.required,
        Validators.pattern('^[a-zA-Z]{2}[0-9]{1,4}$'),
      ]),
      airline: this.fb.control(flight.airlineName, Validators.required),
      departingAirport: this.fb.control(flight.departureAirport.name),
      destinationAirport: this.fb.control(flight.destinationAirport.name),
      plannedDepartureDate: this.fb.control(departureDate, Validators.required),
    });
  }

  protected updateProblemFlight(index?: number) {
    if (index !== undefined) {
      if (this.problemFlightIndex === index) {
        this.stopoverService.setProblemFlightIndex(undefined);
      } else {
        this.stopoverService.setProblemFlightIndex(index);
      }
    }
  }

  protected get problemFlightIndex() {
    return this.stopoverService.problemFlightIndex();
  }

  selectFlightNr(index: number, $event: string) {
    this.stopoverService.setFlightNumber(index, $event);
  }

  selectAirline(index: any, $event: AirlineAttributes) {
    this.stopoverService.setAirline(index, $event.name);
  }

  selectDate(i: number, date: Date) {
    this.stopoverService.setFlightDepartureDate(i, date);
    this.stopoverService.setFlightArrivalDate(i - 1, date);
  }

  resetAllFlightForms() {
    this.flightFormComponents().forEach((formComponent) => {
      formComponent.flightForm.reset();
    });
  }
}
