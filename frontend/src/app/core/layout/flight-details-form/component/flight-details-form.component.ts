import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewChild,
  Input
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type { FlightDetailsForm } from '../../../../shared/types';
import { TranslocoPipe } from '@jsverse/transloco';
import { AirportAttributes, AirportService } from '../service/airport.service';
import { NgForOf } from '@angular/common';
import {
  MatError,
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
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
import { startWith, Subject, takeUntil } from 'rxjs';

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
    MatTimepickerToggle,
    MatTimepicker,
    MatTimepickerInput,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatError,
  ],
})
export class FlightDetailsFormComponent implements OnInit, OnDestroy {
  private readonly _isValid = signal(false);
  public filteredAirports: AirportAttributes[] = [];
  public readonly isValid = this._isValid.asReadonly();
  private airportService = inject(AirportService);
  private airports: AirportAttributes[] = [];
  public readonly next = output<void>();
  private onDestroy$ = new Subject<void>();

  @Input() flightForm!: FormGroup<FlightDetailsForm>;

  ngOnInit(): void {
    this.subscribeToFetchAirports();
    this.subscribeAllFormElements();
    this.flightForm.statusChanges.subscribe((status) => {
      this._isValid.set(status === 'VALID');
    });
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private subscribeToFetchAirports() {
    this.airportService.getAirports().subscribe((data) => {
      this.airports = data;
      this.filteredAirports = this.filterAirports(this.flightForm.controls.departingAirport.value);
    });
  }

  private subscribeAllFormElements() {
    this.subscribeAirportFieldToFilterAirports(this.flightForm.controls.departingAirport);
    this.subscribeAirportFieldToFilterAirports(this.flightForm.controls.destinationAirport);
  }

  private filterAirports(value: string): AirportAttributes[] {
    const filterValue = (value || '').toLowerCase();
    return this.airports.filter((airport) => airport.name.toLowerCase().includes(filterValue));

  }

  private subscribeAirportFieldToFilterAirports(control: FormControl<string> | null): void {
    control?.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((val) => {
      this.filteredAirports = this.filterAirports(val);
    });
  }

}
