import { Component, effect, inject, Input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  MatError,
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
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
import { Subject, takeUntil } from 'rxjs';
import { ReservationDetailsForm } from '../../../shared/types/form.types';
import { AirportAttributes } from '../../../shared/types/types';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AirportsService } from '../../flight-details-form/service/airport.service';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrl: './reservation-details.component.scss',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatSuffix,
    MatTimepickerToggle,
    MatTimepicker,
    MatTimepickerInput,
    MatError,
    ScrollingModule,
  ],
})
export class ReservationDetailsFormComponent implements OnInit, OnDestroy {
  private airportService = inject(AirportsService);
  private onDestroy$ = new Subject<void>();

  public showDepartDropdown = false;
  public showDestDropdown = false;
  public filteredDepartAirports: AirportAttributes[] = [];
  public filteredDestAirports: AirportAttributes[] = [];

  @Input() reservationForm!: FormGroup<ReservationDetailsForm>;

  public readonly airportsSignal = this.airportService.airportsSignal;

  public searchValue = signal('');

  public readonly next = output<void>();
  public readonly previous = output<void>();

  constructor() {
    effect(() => {
      if (this.airportService.isLoading()) {
        this.reservationForm?.controls.departingAirport.disable();
        this.reservationForm?.controls.destinationAirport.disable();
      } else {
        this.reservationForm?.controls.departingAirport.enable();
        this.reservationForm?.controls.destinationAirport.enable();
      }
    });
  }

  ngOnInit(): void {
    this.reservationForm.controls.departingAirport.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value: string) => {
        this.searchValue.set(value || '');
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private filterAirports(value: string): AirportAttributes[] {
    const val = value.toLowerCase();
    const airports = this.airportsSignal();
    return airports.filter((airport) => airport.name?.toLowerCase().includes(val));
  }

  public onDepartInput(value: string) {
    this.filteredDepartAirports = this.filterAirports(value);
    this.showDepartDropdown = true;
  }

  public onDestInput(value: string) {
    this.filteredDestAirports = this.filterAirports(value);
    this.showDestDropdown = true;
  }

  public hideDropdownWithDelay() {
    setTimeout(() => (this.showDepartDropdown = false), 200);
  }

  public hideDestDropdownWithDelay() {
    setTimeout(() => (this.showDestDropdown = false), 200);
  }

  public selectDepartAirport(name: string) {
    this.reservationForm.controls.departingAirport.setValue(name);
    this.showDepartDropdown = false;
  }

  public selectDestAirport(name: string) {
    this.reservationForm.controls.destinationAirport.setValue(name);
    this.showDestDropdown = false;
  }
}
