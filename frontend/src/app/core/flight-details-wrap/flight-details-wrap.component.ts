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
import { NgForOf } from '@angular/common';
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
  @Output() rewardValueSent = new EventEmitter<string>();

  public validForms = computed(() =>
    this.flightFormComponents()
      .map((form) => form.isValid())
      .every((value) => value)
  );

  protected connectingFlights = computed(() => {
    const flights = this.stopoverService.stopoverState().flights;

    console.log(flights);

    const forms: FormGroup<FlightDetailsForm>[] = [];

    for (let i = 0; i < flights.length; i += 1) {
      let newForm = this.createForm(flights[i]);
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

  private createForm(flight: Flight): FormGroup<FlightDetailsForm> {
    const departureDate = flight.departureTime ? new Date(flight.departureTime) : null;

    return this.fb.group<FlightDetailsForm>({
      flightNr: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]{2}[0-9]{1,4}$'),
      ]),
      airline: this.fb.control('', Validators.required),
      departingAirport: this.fb.control(flight.departureAirport),
      destinationAirport: this.fb.control(flight.destinationAirport),
      plannedDepartureDate: this.fb.control(departureDate, Validators.required),
    });
  }

  protected updateProblemFlight(index?: number) {
    if (index != undefined) {
      this.stopoverService.setProblemFlightIndex(index);
    }
  }

  protected get problemFlightIndex() {
    return this.stopoverService.problemFlightIndex();
  }

  protected saveDate($event: Date | null, index: number) {
    this.stopoverService.setFlightDepartureDate(index, $event);
    this.stopoverService.setFlightArrivalDate(index - 1, $event);
    const forms = this.connectingFlights();
    if (forms[index]) {
      forms[index].controls.plannedDepartureDate.setValue($event);
    }
  }

  saveFlightNr($event: string, index: number) {
    this.stopoverService.setFlightNumber(index, $event);
  }

  selectAirline(index: any, $event: AirlineAttributes) {
    this.stopoverService.setAirline(index, $event.name);
  }

  selectDate(i: number, date: Date) {
    this.stopoverService.setFlightDepartureDate(i, date);
    this.stopoverService.setFlightArrivalDate(i - 1, date);
  }
}
