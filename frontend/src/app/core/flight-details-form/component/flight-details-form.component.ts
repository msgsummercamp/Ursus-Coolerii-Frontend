import { Component, effect, inject, Input, OnDestroy, OnInit, output, signal } from '@angular/core';
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
import { startWith, Subject, Subscription, takeUntil } from 'rxjs';
import { AirlineAttributes, AirlineService } from '../service/airline.service';
import { AirportsService } from '../service/airport.service';
import { FlightDetailsForm } from '../../../shared/types/form.types';
import { CaseFileService } from '../../layout/services/case-file.service';
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
  private readonly _isValid = signal(false);
  private airportService = inject(AirportsService);
  private airlineService = inject(AirlineService);
  private airlines: AirlineAttributes[] = [];
  private onDestroy$ = new Subject<void>();

  public showDepartDropdown = false;
  public showDestDropdown = false;
  protected filteredAirlines: AirlineAttributes[] = [];
  public filteredDepartAirports: AirportAttributes[] = [];
  public filteredDestAirports: AirportAttributes[] = [];

  @Input() flightForm!: FormGroup<FlightDetailsForm>;

  public readonly airportsSignal = this.airportService.airportsSignal;

  public searchValue = signal('');

  public readonly next = output<void>();
  public readonly previous = output<void>();
  public validForms = computed(() => this._isValid());
  private caseFileService = inject(CaseFileService);
  reward: number | null = null;
  private subscriptions: Subscription[] = [];

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

  public connectingFlights: FormGroup<FlightDetailsForm>[] = [];
  ngOnInit(): void {
    this.subscribeToForms();
    // this.subscribeToFetchAirports();
    // this.subscribeAllFormElements();
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

  protected continue() {
    this.next.emit();
  }

  protected back() {
    this.previous.emit();
  }

  private checkAndFetchReward(): void {
    if (this.validForms()) {
      const caseFile = this.buildCaseFileFromForms();
      this.caseFileService.calculateReward(caseFile).subscribe((reward) => {
        this.reward = reward;
      });
    } else {
      this.reward = null;
    }
  }

  private buildCaseFileFromForms() {
    const allFlightForms = [this.flightForm, ...this.connectingFlights];

    const airports: FormGroup<FlightDetailsForm>[] = allFlightForms.filter(
      (f, index) => index === 0 || index === allFlightForms.length - 1
    );

    return {
      departureAirport: airports[0].controls.departingAirport.value,
      destinationAirport: airports[airports.length - 1].controls.destinationAirport.value,
    };
  }

  private updateValidity() {
    // const allValid = this.flightForm.valid && this.connectingFlights.every((f) => f.valid);
    // this._isValid.set(allValid);
  }

  private subscribeToForms() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.subscribeToNewForm(this.flightForm);
    this.connectingFlights.forEach((f) => {
      this.subscribeToNewForm(f);
    });
    this.updateValidity();
  }

  private subscribeToNewForm(formToSub: FormGroup<FlightDetailsForm>): void {
    // this.subscriptions.push(formToSub.statusChanges.subscribe(() => this.updateValidity()));
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
    this.flightForm.controls.departingAirport.setValue(name);
    this.showDepartDropdown = false;
  }

  public selectDestAirport(name: string) {
    this.flightForm.controls.destinationAirport.setValue(name);
    this.showDestDropdown = false;
  }
}
