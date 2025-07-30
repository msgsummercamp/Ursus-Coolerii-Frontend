import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  ],
  providers: [provideNativeDateAdapter()],
})
export class FlightDetailsFormComponent implements OnInit {
  flightForm: FormGroup;
  airports: AirportAttributes[] = [];

  constructor(
    private fb: FormBuilder,
    private airportService: AirportService
  ) {
    this.flightForm = this.fb.group({
      flightDate: ['', Validators.required],
      flightNr: ['', Validators.required],
      airline: ['', Validators.required],
      departingAirport: ['', Validators.required],
      destinationAirport: ['', Validators.required],
      connectingFlights: ['', Validators.required],
      plannedDepartureDate: ['', Validators.required],
      plannedArrivalDate: ['', Validators.required],
      plannedDepartureTime: ['', Validators.required],
      plannedArrivalTime: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.airportService.getAirports().subscribe((data) => {
      this.airports = data;
    });
  }

  public onSubmit() {
    if (this.flightForm.valid) {
    } else {
      this.flightForm.markAllAsTouched();
    }
  }
}
