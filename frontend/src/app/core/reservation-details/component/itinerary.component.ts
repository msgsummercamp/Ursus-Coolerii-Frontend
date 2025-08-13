import { Component, effect, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { translate, TranslocoPipe } from '@jsverse/transloco';
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
  MatDatepickerInputEvent,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { delay, iif, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ReservationDetailsForm } from '../../../shared/types/form.types';
import { AirportAttributes } from '../../../shared/types/types';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AirportsService } from '../../flight-details-form/service/airport.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { StopoverService } from '../../../shared/services/stopover.service';
import { LoadingSpinnerComponent } from '../../loading-spinner/component/loading-spinner.component';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { toObservable } from '@angular/core/rxjs-interop';
import { CaseFileService } from '../../layout/services/case-file.service';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';

const emptyAirport: AirportAttributes = {
  name: '',
  iata: '',
};

@Component({
  selector: 'app-reservation-details',
  templateUrl: './itinerary.component.html',
  styleUrl: './itinerary.component.scss',
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
    MatError,
    ScrollingModule,
    MatButton,
    MatIconButton,
    MatIcon,
    LoadingSpinnerComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatOption,
    MatAutocompleteTrigger,
    MatAutocomplete,
  ],
})
export class ItineraryFormComponent implements OnInit, OnDestroy {
  private airportService = inject(AirportsService);
  private stopoverService = inject(StopoverService);
  private caseFileService = inject(CaseFileService);

  protected stopoverDisplayValue = signal('');

  private onDestroy$ = new Subject<void>();

  public showDepartDropdown = false;
  public showDestDropdown = false;
  public showStopoverDropdown = false;
  public filteredDepartAirports: AirportAttributes[] = [];
  public filteredDestAirports: AirportAttributes[] = [];
  public filteredStopoverAirports: AirportAttributes[] = [];

  private fb = inject(NonNullableFormBuilder);

  public reservationForm = this.fb.group<ReservationDetailsForm>({
    departingAirport: this.fb.control('', Validators.required),
    destinationAirport: this.fb.control('', Validators.required),
    plannedDepartureDate: this.fb.control(null, Validators.required),
    plannedArrivalDate: this.fb.control(null, Validators.required),
    stopover: this.fb.control(emptyAirport),
  });

  private readonly _isValid = signal(false);
  public readonly isValid = this._isValid.asReadonly();

  public readonly airportsSignal = this.airportService.airportsSignal;

  public searchValue = signal('');

  private isLoading$ = toObservable(this.airportService.isLoading);
  private delayedLoading$ = this.isLoading$.pipe(
    switchMap((loading) => iif(() => loading, of(loading).pipe(delay(500)), of(loading)))
  );

  public readonly next = output<void>();
  public readonly previous = output<void>();
  protected isLoading = signal(false);

  constructor() {
    this.delayedLoading$.subscribe((loading) => {
      this.isLoading.set(loading);
    });

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
    this.reservationForm.statusChanges.subscribe((status) => {
      this._isValid.set(status === 'VALID');
      this.caseFileService.calculateReward(
        this.reservationForm.controls.departingAirport.value,
        this.reservationForm.controls.destinationAirport.value
      );
    });

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

  protected continue() {
    this.next.emit();
  }
  protected back() {
    this.previous.emit();
  }

  private filterAirports(value: string): AirportAttributes[] {
    const val = value.toLowerCase();
    const airports = this.airportsSignal();
    const selectedAirports = new Set([
      this.stopoverService.stopoverState().departureAirport?.iata,
      ...this.stopoverService.stopoverState().stopovers.map((airport) => airport.iata),
      this.stopoverService.stopoverState().destinationAirport?.iata,
    ]);
    return airports.filter(
      (airport) =>
        !selectedAirports.has(airport.iata) &&
        (airport.name?.toLowerCase().includes(val) || airport.iata?.toLowerCase().includes(val))
    );
  }

  public onDepartInput(value: string) {
    this.filteredDepartAirports = this.filterAirports(value);
    this.showDepartDropdown = true;
  }

  public onDestInput(value: string) {
    this.filteredDestAirports = this.filterAirports(value);
    this.showDestDropdown = true;
  }

  public onStopoverInput(value: string) {
    this.filteredStopoverAirports = this.filterAirports(value).slice(0, 32);
    console.log(this.filteredStopoverAirports);
    this.showStopoverDropdown = true;
    setTimeout(() => {}, 0);
  }

  public trackByAirport(_index: number, airport: AirportAttributes): string {
    return airport.iata;
  }

  public hideDropdownWithDelay() {
    setTimeout(() => (this.showDepartDropdown = false), 200);
  }

  public hideStopoverDropdownWithDelay() {
    setTimeout(() => (this.showStopoverDropdown = false), 200);
  }

  public selectDepartAirport(airport: AirportAttributes) {
    this.reservationForm.controls.departingAirport.setValue(airport.name);
    this.showDepartDropdown = false;
    this.stopoverService.setDepartureAirport(airport);
    this.filteredDepartAirports = [];
  }

  public selectDestAirport(airport: AirportAttributes) {
    this.reservationForm.controls.destinationAirport.setValue(airport.name);
    this.showDestDropdown = false;
    this.stopoverService.setDestinationAirport(airport);
    this.filteredDestAirports = [];
  }

  public selectStopoverAirport(airport: AirportAttributes) {
    this.reservationForm.controls.stopover.setValue(airport);
    this.stopoverDisplayValue.set(airport.name);
    this.showStopoverDropdown = false;
  }

  protected addStopover() {
    const stopoverToAdd = this.reservationForm.controls.stopover.value;
    const stopovers = this.stopoverService.stopoverState().stopovers;
    if (
      stopovers.length < 3 &&
      !stopovers.includes(stopoverToAdd) &&
      stopoverToAdd != emptyAirport
    ) {
      this.stopoverService.addStopover(this.reservationForm.controls.stopover.value);
      this.stopoverDisplayValue.set('');
    }
    this.filteredStopoverAirports = [];
  }
  protected removeStopover(stopoverIndex: number) {
    this.stopoverService.removeStopover(stopoverIndex);
    this.stopoverService.setProblemFlightIndex(0);
  }

  protected get stopovers() {
    return this.stopoverService.stopoverState().stopovers;
  }

  protected readonly translate = translate;

  protected setDepartureDate($event: MatDatepickerInputEvent<Date>) {
    this.stopoverService.setDepartureDate($event.value);
  }

  protected setDestinationDate($event: MatDatepickerInputEvent<Date>) {
    this.stopoverService.setDestinationDate($event.value);
  }
}
