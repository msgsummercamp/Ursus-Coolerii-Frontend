import {
  Component,
  computed,
  effect,
  inject,
  Input,
  OnDestroy,
  OnInit,
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
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerToggle,
} from '@angular/material/timepicker';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { startWith, Subject, takeUntil } from 'rxjs';
import { AirlineAttributes, AirlineService } from '../service/airline.service';
import { FlightDetailsForm } from '../../../../shared/types/form.types';
import { AirportsService } from '../service/airport.service';
import { AirportAttributes } from '../../../../shared/types/types'; // <-- Add this import
import { ScrollingModule } from '@angular/cdk/scrolling';

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
    ScrollingModule,
  ],
})
export class FlightDetailsFormComponent implements OnInit, OnDestroy {
  private airlineService = inject(AirlineService);
  private airlines: AirlineAttributes[] = [];
  private onDestroy$ = new Subject<void>();

  public showDepartDropdown = false;
  public showDestDropdown = false;
  protected filteredAirlines: AirlineAttributes[] = [];
  public filteredDepartAirports: AirportAttributes[] = [];
  public filteredDestAirports: AirportAttributes[] = [];

  @Input() flightForm!: FormGroup<FlightDetailsForm>;
  private airportService = inject(AirportsService);

  public readonly airportsSignal = this.airportService.airportsSignal;

  public searchValue = signal('');

  public filteredAirports = computed(() => {
    const val = this.searchValue().toLowerCase();
    const airports = this.airportsSignal();
    return airports.filter((airport) => airport.name?.toLowerCase().includes(val));
  });

  public readonly next = output<void>();

  constructor() {
    effect(() => {
      if (this.airportService.isLoading()) {
        this.flightForm?.controls.departingAirport.disable();
        this.flightForm?.controls.destinationAirport.disable();
      } else {
        this.flightForm?.controls.departingAirport.enable();
        this.flightForm?.controls.destinationAirport.enable();
      }
    });
  }

  ngOnInit(): void {
    this.flightForm.controls.departingAirport.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value: string) => {
        this.searchValue.set(value || '');
      });

    this.subscribeToFetchAirlines();
    this.subscribeToAirlineAutocomplete();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
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

  // Filtering method
  private filterAirports(value: string): AirportAttributes[] {
    const val = value.toLowerCase();
    const airports = this.airportsSignal();
    return airports.filter((airport) => airport.name?.toLowerCase().includes(val));
  }

  // Usage in handlers
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
    this.flightForm.controls.departingAirport.setValue(name);
    this.showDepartDropdown = false;
  }

  public selectDestAirport(name: string) {
    this.flightForm.controls.destinationAirport.setValue(name);
    this.showDestDropdown = false;
  }
}
