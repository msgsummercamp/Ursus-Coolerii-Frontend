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
import { AirportAttributes, Flight } from '../../shared/types/types';
import { MatCheckbox } from '@angular/material/checkbox';
import { CaseFileService } from '../layout/services/case-file.service';

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
  private caseFileService = inject(CaseFileService);
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
    // this.passDataToParent();
    this.next.emit();
  }
  protected back() {
    this.previous.emit();
  }

  // public passDataToParent() {
  //   const data = this.getMainFormRaw;
  //   if (!data) return;
  //   this.receiveMessage.emit(data);
  // }
  //
  // public get getMainFormRaw(): Flight | null {
  //   return this.transformFlightData();
  // }

  private computeTime(datePart: Date, timePart: any): string | null {
    if (!datePart || !timePart) {
      return null;
    }
    if (timePart instanceof Date) {
      const hours = timePart.getHours().toString().padStart(2, '0');
      const minutes = timePart.getMinutes().toString().padStart(2, '0');
      datePart.setHours(Number(hours));
      datePart.setMinutes(Number(minutes));
      const year = datePart.getFullYear();
      const month = (datePart.getMonth() + 1).toString().padStart(2, '0');
      const day = datePart.getDate().toString().padStart(2, '0');
      const hour = datePart.getHours().toString().padStart(2, '0');
      const minute = datePart.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day}T${hour}:${minute}:00`;
    }

    return null;
  }

  // private transformFlightData(): Flight | null {
  //   // const raw = this.form.getRawValue();
  //   //
  //   if (
  //     !raw.plannedDepartureDate ||
  //     !raw.plannedArrivalDate ||
  //     !raw.plannedDepartureTime ||
  //     !raw.plannedArrivalTime
  //   ) {
  //     return null;
  //   }
  //
  //   const departureTime = this.computeTime(raw.plannedDepartureDate, raw.plannedDepartureTime);
  //   const arrivalTime = this.computeTime(raw.plannedArrivalDate, raw.plannedArrivalTime);
  //
  //   if (!departureTime || !arrivalTime) {
  //     return null;
  //   }
  //
  //   return {
  //     flightNumber: raw.flightNr,
  //     airlineName: raw.airline,
  //     departureAirport: raw.departingAirport,
  //     destinationAirport: raw.destinationAirport,
  //     departureTime,
  //     arrivalTime,
  //     firstFlight: true,
  //     lastFlight: true,
  //     problemFlight: true,
  //   };
  // }

  private createForm(
    departingAirport: AirportAttributes,
    destinationAirport: AirportAttributes
  ): FormGroup<FlightDetailsForm> {
    return this.fb.group<FlightDetailsForm>({
      flightNr: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]{2}[0-9]{1,4}$'),
      ]),
      airline: this.fb.control('', Validators.required),
      departingAirport: this.fb.control(departingAirport),
      destinationAirport: this.fb.control(destinationAirport),
      plannedDepartureDate: this.fb.control(null, Validators.required),
    });
  }

  //
  // private buildCaseFileFromForms() {
  //   const allFlightForms = [this.form, ...this.connectingFlights];
  //
  //   const airports: FormGroup<FlightDetailsForm>[] = allFlightForms.filter(
  //     (f, index) => index === 0 || index === allFlightForms.length - 1
  //   );
  //   return {
  //     departureAirport: airports[0].controls.departingAirport.value,
  //     destinationAirport: airports[airports.length - 1].controls.destinationAirport.value,
  //   };
  // }

  protected updateProblemFlight(index?: number) {
    if (index != undefined) {
      this.stopoverService.setProblemFlight(index);
    }
  }

  protected get problemFlightIndex() {
    return this.stopoverService.stopoverState().problemFlightIndex;
  }
}
