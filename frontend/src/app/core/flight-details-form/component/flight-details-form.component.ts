import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  output,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgForOf } from '@angular/common';
import {
  MatError,
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerInputEvent,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { startWith, Subject, takeUntil } from 'rxjs';
import { AirlineAttributes, AirlineService } from '../service/airline.service';
import { FlightDetailsForm } from '../../../shared/types/form.types';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { StopoverService } from '../../../shared/services/stopover.service';

@Component({
  selector: 'app-flight-details-form',
  templateUrl: './flight-details-form.component.html',
  styleUrl: './flight-details-form.component.scss',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    NgForOf,
    MatFormField,
    MatLabel,
    MatOption,
    MatInput,
    MatHint,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatSuffix,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatError,
    ScrollingModule,
  ],
})
export class FlightDetailsFormComponent implements OnInit, OnDestroy {
  @Output() airline: EventEmitter<AirlineAttributes> = new EventEmitter<AirlineAttributes>();
  @Output() date: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() flightNr: EventEmitter<string> = new EventEmitter<string>();

  @Input() flightForm!: FormGroup<FlightDetailsForm>;

  private airlineService = inject(AirlineService);

  private stopoverService = inject(StopoverService);
  private readonly _isValid = signal(false);

  private airlines: AirlineAttributes[] = [];
  private onDestroy$ = new Subject<void>();
  protected filteredAirlines: AirlineAttributes[] = [];

  public isValid = this._isValid.asReadonly();

  public readonly next = output<void>();
  public readonly previous = output<void>();

  ngOnInit(): void {
    this.flightForm.statusChanges.subscribe((status) => {
      this._isValid.set(status === 'VALID');
    });
    this.subscribeToFetchAirlines();
    this.subscribeToAirlineAutocomplete();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  protected get minDate() {
    return this.stopoverService.stopoverState().departureDate;
  }

  protected get maxDate() {
    return this.stopoverService.stopoverState().destinationDate;
  }

  protected selectAirline(airline: AirlineAttributes) {
    this.flightForm.controls.airline.setValue(airline.name);
    this.airline.emit(airline);
  }

  selectFlightNr() {
    const flightNumber = this.flightForm.controls.flightNr.value;
    this.flightNr.emit(flightNumber);
  }

  protected selectDate(date: MatDatepickerInputEvent<Date>) {
    this.flightForm.controls.plannedDepartureDate.setValue(date.value);
    this.date.emit(date.value || undefined);
  }

  private subscribeToFetchAirlines() {
    const airlineList = this.airlineService.airLineList;
    if (airlineList) {
      airlineList.subscribe((data: AirlineAttributes[]) => {
        const seenNames = new Set<string>();
        this.airlines = data.filter((a) => {
          if (seenNames.has(a.name)) return false;
          seenNames.add(a.name);
          return true;
        });
      });
    }
  }

  private subscribeToAirlineAutocomplete() {
    this.flightForm.controls.airline.valueChanges
      .pipe(takeUntil(this.onDestroy$), startWith(''))
      .subscribe((val: string) => {
        if (val && val.length >= 1) {
          this.filteredAirlines = this.airlines.filter((airline) =>
            airline.name.toLowerCase().includes(val.toLowerCase())
          );
        } else {
          this.filteredAirlines = [];
        }
      });
  }
}
