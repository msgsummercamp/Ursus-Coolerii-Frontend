import { Component, OnInit, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
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

export function departureBeforeArrivalValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const depDate = group.get('plannedDepartureDate')?.value;
    const arrDate = group.get('plannedArrivalDate')?.value;
    const depTime = group.get('plannedDepartureTime')?.value;
    const arrTime = group.get('plannedArrivalTime')?.value;

    const depDateStr = depDate instanceof Date ? depDate.toISOString().slice(0, 10) : depDate;
    const arrDateStr = arrDate instanceof Date ? arrDate.toISOString().slice(0, 10) : arrDate;

    if (depDateStr && arrDateStr && depTime && arrTime && depDateStr === arrDateStr) {
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
  providers: [provideNativeDateAdapter()],
})
export class FlightDetailsFormComponent implements OnInit {
  private readonly _isValid = signal(false);

  flightForm: FormGroup;
  airports: AirportAttributes[] = [];

  filteredDepartingAirports: AirportAttributes[] = [];
  filteredDestinationAirports: AirportAttributes[] = [];
  filteredConnectingDestAirports: AirportAttributes[][] = [];

  public readonly isValid = this._isValid.asReadonly();
  public readonly next = output<void>();
  public readonly previous = output<void>();

  private connectingFlightSyncSubs: any[] = [];

  constructor(
    private fb: FormBuilder,
    private airportService: AirportService
  ) {
    this.flightForm = this.fb.group(
      {
        flightDate: ['', Validators.required],
        flightNr: ['', Validators.required],
        airline: ['', Validators.required],
        departingAirport: ['', Validators.required],
        destinationAirport: ['', Validators.required],
        plannedDepartureDate: ['', Validators.required],
        plannedArrivalDate: ['', Validators.required],
        plannedDepartureTime: ['', Validators.required],
        plannedArrivalTime: ['', Validators.required],
        connectingFlights: this.fb.array([]),
      },
      { validators: departureBeforeArrivalValidator() }
    );
  }

  ngOnInit(): void {
    this.airportService.getAirports().subscribe((data) => {
      this.airports = data;
      this.filteredDepartingAirports = this.filterAirports(
        this.flightForm.get('departingAirport')?.value
      );
      this.filteredDestinationAirports = this.filterAirports(
        this.flightForm.get('destinationAirport')?.value
      );
      this.setupConnectingFlightListeners();
    });
    this.flightForm.statusChanges.subscribe((status) => {
      this._isValid.set(status === 'VALID');
    });

    this.flightForm.get('destinationAirport')?.valueChanges.subscribe((value) => {
      if (this.connectingFlights().length > 0) {
        this.connectingFlights()
          .at(0)
          .get('departingAirport')
          ?.setValue(value, { emitEvent: false });
      }
    });

    this.flightForm
      .get('departingAirport')
      ?.valueChanges.pipe(startWith(''))
      .subscribe((value) => {
        this.filteredDepartingAirports = this.filterAirports(value);
      });

    this.flightForm
      .get('destinationAirport')
      ?.valueChanges.pipe(startWith(''))
      .subscribe((value) => {
        this.filteredDestinationAirports = this.filterAirports(value);
      });

    this.flightForm.get('flightDate')?.valueChanges.subscribe((value) => {
      if (this.flightForm.get('plannedDepartureDate')?.value !== value) {
        this.flightForm.get('plannedDepartureDate')?.setValue(value, { emitEvent: false });
      }
    });
    this.flightForm.get('plannedDepartureDate')?.valueChanges.subscribe((value) => {
      if (this.flightForm.get('flightDate')?.value !== value) {
        this.flightForm.get('flightDate')?.setValue(value, { emitEvent: false });
      }
    });

    this.flightForm.get('plannedDepartureTime')?.valueChanges.subscribe(() => {
      this.flightForm.updateValueAndValidity({ onlySelf: false, emitEvent: false });
    });
    this.flightForm.get('plannedArrivalTime')?.valueChanges.subscribe(() => {
      this.flightForm.updateValueAndValidity({ onlySelf: false, emitEvent: false });
    });

    this.connectingFlights().valueChanges.subscribe(() => {
      this.setupConnectingFlightListeners();
    });
    this.setupConnectingFlightListeners();
  }

  private setupConnectingFlightListeners() {
    this.connectingFlightSyncSubs.forEach((sub) => sub.unsubscribe && sub.unsubscribe());
    this.connectingFlightSyncSubs = [];

    if (this.connectingFlights().length > 0) {
      const first = this.connectingFlights().at(0);
      const sub = this.flightForm.get('destinationAirport')?.valueChanges.subscribe((value) => {
        first.get('departingAirport')?.setValue(value, { emitEvent: false });
      });
      if (sub) this.connectingFlightSyncSubs.push(sub);
      first
        .get('departingAirport')
        ?.setValue(this.flightForm.get('destinationAirport')?.value, { emitEvent: false });
    }

    for (let i = 0; i < this.connectingFlights().length - 1; i++) {
      const current = this.connectingFlights().at(i);
      const next = this.connectingFlights().at(i + 1);
      const sub = current.get('destinationAirport')?.valueChanges.subscribe((value) => {
        next.get('departingAirport')?.setValue(value, { emitEvent: false });
      });
      if (sub) this.connectingFlightSyncSubs.push(sub);
      next
        .get('departingAirport')
        ?.setValue(current.get('destinationAirport')?.value, { emitEvent: false });
    }
    this.filteredConnectingDestAirports = [];
    for (let i = 0; i < this.connectingFlights().length; i++) {
      const group = this.connectingFlights().at(i);
      this.filteredConnectingDestAirports[i] = this.filterAirports(
        group.get('destinationAirport')?.value
      );
      const sub = group
        .get('destinationAirport')
        ?.valueChanges.pipe(startWith(group.get('destinationAirport')?.value || ''))
        .subscribe((value) => {
          this.filteredConnectingDestAirports[i] = this.filterAirports(value);
        });
      if (sub) this.connectingFlightSyncSubs.push(sub);
      const sub1 = group.get('flightDate')?.valueChanges.subscribe((value) => {
        if (group.get('plannedDepartureDate')?.value !== value) {
          group.get('plannedDepartureDate')?.setValue(value, { emitEvent: false });
        }
      });
      if (sub1) this.connectingFlightSyncSubs.push(sub1);
      const sub2 = group.get('plannedDepartureDate')?.valueChanges.subscribe((value) => {
        if (group.get('flightDate')?.value !== value) {
          group.get('flightDate')?.setValue(value, { emitEvent: false });
        }
      });
      if (sub2) this.connectingFlightSyncSubs.push(sub2);
      group.get('plannedDepartureTime')?.valueChanges.subscribe(() => {
        group.updateValueAndValidity({ onlySelf: false, emitEvent: false });
      });
      group.get('plannedArrivalTime')?.valueChanges.subscribe(() => {
        group.updateValueAndValidity({ onlySelf: false, emitEvent: false });
      });
    }
  }

  public connectingFlights(): FormArray {
    return this.flightForm.get('connectingFlights') as FormArray;
  }

  public addConnectingFlight(): void {
    if (this.connectingFlights().length >= 4) return;

    let prevDeparture: string | null = null;
    if (this.connectingFlights().length === 0) {
      prevDeparture = this.flightForm.get('destinationAirport')?.value;
    } else {
      prevDeparture = this.connectingFlights()
        .at(this.connectingFlights().length - 1)
        .get('destinationAirport')?.value;
    }

    this.connectingFlights().push(
      this.fb.group(
        {
          flightNr: ['', Validators.required],
          flightDate: ['', Validators.required],
          departingAirport: [prevDeparture, Validators.required],
          destinationAirport: ['', Validators.required],
          plannedDepartureDate: ['', Validators.required],
          plannedArrivalDate: ['', Validators.required],
          plannedDepartureTime: ['', Validators.required],
          plannedArrivalTime: ['', Validators.required],
        },
        { validators: departureBeforeArrivalValidator() }
      )
    );
  }

  public removeConnectingFlight(index: number): void {
    this.connectingFlights().removeAt(index);
  }

  public disableAddConnectingFlight(): boolean {
    if (this.connectingFlights().length >= 4) return true;
    if (
      this.flightForm.get('flightDate')?.invalid ||
      this.flightForm.get('flightNr')?.invalid ||
      this.flightForm.get('airline')?.invalid ||
      this.flightForm.get('departingAirport')?.invalid ||
      this.flightForm.get('destinationAirport')?.invalid ||
      this.flightForm.get('plannedDepartureDate')?.invalid ||
      this.flightForm.get('plannedArrivalDate')?.invalid ||
      this.flightForm.get('plannedDepartureTime')?.invalid ||
      this.flightForm.get('plannedArrivalTime')?.invalid
    ) {
      return true;
    }
    for (let i = 0; i < this.connectingFlights().length; i++) {
      if (this.connectingFlights().at(i).invalid) return true;
    }
    return false;
  }

  private filterAirports(value: string): AirportAttributes[] {
    const filterValue = (value || '').toLowerCase();
    return this.airports.filter((airport) => airport.name.toLowerCase().startsWith(filterValue));
  }

  protected continue() {
    this.next.emit();
  }

  protected back() {
    this.previous.emit();
  }
}
