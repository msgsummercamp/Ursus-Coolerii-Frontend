import { Component, inject, OnInit, output, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type { FlightDetailsForm } from '../../../../shared/types';
import { TranslocoPipe } from '@jsverse/transloco';
import { AirportAttributes, AirportService } from '../service/airport.service';
import { NgForOf } from '@angular/common';
import { MatFormField, MatHint, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerToggle,
} from '@angular/material/timepicker';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { startWith } from 'rxjs';

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
    MatSelect,
    MatOption,
    MatInput,
    MatButton,
    MatHint,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatSuffix,
    MatTimepickerToggle,
    MatTimepicker,
    MatTimepickerInput,
    MatAutocomplete,
    MatAutocompleteTrigger,
  ],
})
export class FlightDetailsFormComponent implements OnInit {
  private readonly _isValid = signal(false);
  public filteredAirports: AirportAttributes[] = [];
  public readonly isValid = this._isValid.asReadonly();
  private fb = inject(NonNullableFormBuilder);
  private airportService = inject(AirportService);
  private airports: AirportAttributes[] = [];

  protected readonly flightForm = this.fb.group<FlightDetailsForm>(
    {
      flightNr: this.fb.control('', Validators.required),
      airline: this.fb.control('', Validators.required),
      departingAirport: this.fb.control('', Validators.required),
      destinationAirport: this.fb.control('', Validators.required),
      plannedDepartureDate: this.fb.control(null, Validators.required),
      plannedArrivalDate: this.fb.control(null, Validators.required),
      plannedDepartureTime: this.fb.control('', Validators.required),
      plannedArrivalTime: this.fb.control('', Validators.required),
    },
    { validators: this.airportService.departureBeforeArrivalValidator() }
  );

  ngOnInit(): void {
    this.airportService.getAirports().subscribe((data) => {
      this.airports = data;
      this.filteredAirports = this.filterAirports(this.flightForm.controls.departingAirport.value);
    });

    this.flightForm.statusChanges.subscribe((status) => {
      this._isValid.set(status === 'VALID');
    });
    this.subscribeAllFormElements();
  }

  private subscribeAllFormElements() {
    this.subscribeAirportFieldToFilterAirports(this.flightForm.controls.departingAirport);
    this.subscribeAirportFieldToFilterAirports(this.flightForm.controls.destinationAirport);
    this.subscribeArrivalTimeField(this.flightForm.controls.plannedDepartureTime);
    this.subscribeArrivalTimeField(this.flightForm.controls.plannedArrivalTime);
  }

  private filterAirports(value: string): AirportAttributes[] {
    const filterValue = (value || '').toLowerCase();
    return this.airports.filter((airport) => airport.name.toLowerCase().startsWith(filterValue));
  }

  private subscribeAirportFieldToFilterAirports(control: FormControl<string> | null): void {
    control?.valueChanges.subscribe((val) => {
      this.filteredAirports = this.filterAirports(val);
    });
  }

  private subscribeArrivalTimeField(control: FormControl<string | null>): void {
    control.valueChanges.subscribe(() => {
      this.flightForm.updateValueAndValidity({ onlySelf: false, emitEvent: false });
    });
  }
}
