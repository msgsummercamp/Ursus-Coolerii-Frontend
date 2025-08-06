import {
  Component,
  computed,
  inject,
  Input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AirportService } from '../service/airport.service';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
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
import { AirportAttributes } from '../../../shared/types/types';
import { FlightDetailsForm } from '../../../shared/types/form.types';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CaseFileService } from '../../layout/services/case-file.service';

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
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardActions,
    MatButton,
    TranslocoDirective,
  ],
})
export class FlightDetailsFormComponent implements OnInit, OnDestroy {
  private readonly _isValid = signal(false);
  private airportService = inject(AirportService);
  private airports: AirportAttributes[] = [];
  private airlineService = inject(AirlineService);
  private airlines: AirlineAttributes[] = [];
  protected filteredAirlines: AirlineAttributes[] = [];
  public readonly next = output<void>();
  public readonly previous = output<void>();
  private onDestroy$ = new Subject<void>();
  public filteredAirports: AirportAttributes[] = [];
  @Input() flightForm!: FormGroup<FlightDetailsForm>;
  public validForms = computed(() => this._isValid());
  private caseFileService = inject(CaseFileService);
  reward: number | null = null;
  private subscriptions: Subscription[] = [];

  public connectingFlights: FormGroup<FlightDetailsForm>[] = [];
  ngOnInit(): void {
    this.subscribeToForms();
    this.subscribeToFetchAirports();
    this.subscribeAllFormElements();
    this.subscribeToFetchAirlines();
    this.subscribeToAirlineAutocomplete();
    this.flightForm.statusChanges.subscribe((status) => {
      this._isValid.set(status === 'VALID');
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private subscribeToFetchAirports() {
    this.airportService.airportList?.subscribe((data) => {
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

  public addConnectingFlight(): void {
    // if (!this.validForms()) return;
    const newForm = this.airportService.createForm();
    this.connectingFlights.push(newForm);

    newForm.statusChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.updateValidity();
    });

    newForm.statusChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.checkAndFetchReward();
    });

    this.subscribeAirportFieldToFilterAirports(newForm.controls.departingAirport);
    this.subscribeAirportFieldToFilterAirports(newForm.controls.destinationAirport);
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
}
