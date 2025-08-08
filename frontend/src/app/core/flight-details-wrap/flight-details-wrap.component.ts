import {
  Component,
  computed,
  EventEmitter,
  inject,
  OnInit,
  Output,
  output,
  signal,
} from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { AirportsService } from '../flight-details-form/service/airport.service';
import { MatButtonModule } from '@angular/material/button';
import { FlightDetailsFormComponent } from '../flight-details-form/component/flight-details-form.component';
import { NgForOf } from '@angular/common';
import { FlightDetailsForm } from '../../shared/types/form.types';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { bindCallback, delay, iif, of, Subscription, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { CaseFileService } from '../layout/services/case-file.service';
import { LoadingSpinnerComponent } from '../loading-spinner/component/loading-spinner.component';

@Component({
  selector: 'app-flight-details-wrap',
  imports: [
    TranslocoPipe,
    MatButtonModule,
    FlightDetailsFormComponent,
    NgForOf,
    MatCardActions,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    LoadingSpinnerComponent,
    LoadingSpinnerComponent,
    TranslocoDirective,
  ],
  templateUrl: './flight-details-wrap.component.html',
  styleUrl: './flight-details-wrap.component.scss',
})
export class FlightDetailsWrapComponent implements OnInit {
  protected readonly next = output<void>();
  protected readonly previous = output<void>();
  private airportService = inject(AirportsService);

  protected isLoading = signal(false);
  private isLoading$ = toObservable(this.airportService.isLoading);
  private delayedLoading$ = this.isLoading$.pipe(
    switchMap((loading) => iif(() => loading, of(loading).pipe(delay(500)), of(loading)))
  );

  constructor() {
    this.delayedLoading$.subscribe((loading) => {
      this.isLoading.set(loading);
    });
  }

  private _isValid = signal(false);
  private subscriptions: Subscription[] = [];
  private caseFileService = inject(CaseFileService);
  private fb = inject(NonNullableFormBuilder);
  protected reward: number | null = null;

  protected continue() {
    this.next.emit();
  }

  protected back() {
    this.previous.emit();
  }

  ///TODO : unsubscribes
  ngOnInit(): void {
    this.subscribeToForms();
    this.form.statusChanges.subscribe(() => this.checkAndFetchReward());

    this.connectingFlights.forEach((f) =>
      f.statusChanges.subscribe(() => this.checkAndFetchReward())
    );
  }

  private checkAndFetchReward() {
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
    const allFlightForms = [this.form, ...this.connectingFlights];

    const airports: FormGroup<FlightDetailsForm>[] = allFlightForms.filter(
      (f, index) => index === 0 || index === allFlightForms.length - 1
    );
    return {
      departureAirport: airports[0].controls.departingAirport.value,
      destinationAirport: airports[airports.length - 1].controls.destinationAirport.value,
    };
  }
  private subscribeToForms() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.subscribeToNewForm(this.form);
    this.connectingFlights.forEach((f) => {
      this.subscribeToNewForm(f);
    });
    this.updateValidity();
  }

  private updateValidity() {
    const allValid = this.form.valid && this.connectingFlights.every((f) => f.valid);
    this._isValid.set(allValid);
  }
  public form = this.createForm();

  public connectingFlights: FormGroup<FlightDetailsForm>[] = [];

  public validForms = computed(() => this._isValid());

  private subscribeToNewForm(formToSub: FormGroup<FlightDetailsForm>): void {
    this.subscriptions.push(formToSub.statusChanges.subscribe(() => this.updateValidity()));
  }

  public addConnectingFlight() {
    // if (!this.validForms()) return;

    const newForm = this.createForm();
    this.subscribeToNewForm(newForm);
    this.subscribeToForms();
    newForm.statusChanges.subscribe(() => this.checkAndFetchReward());
    this.connectingFlights.push(newForm);
  }

  public removeConnectingFlight() {
    if (this.connectingFlights.length === 0) return;
    this.subscriptions.pop()?.unsubscribe();
    this.connectingFlights.pop();
    this.updateValidity();
  }
  protected readonly bindCallback = bindCallback;

  private createForm() {
    return this.fb.group<FlightDetailsForm>(
      {
        flightNr: this.fb.control('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z]{2}[0-9]{1,4}$'),
        ]),
        airline: this.fb.control('', Validators.required),
        departingAirport: this.fb.control('', Validators.required),
        destinationAirport: this.fb.control('', Validators.required),
        plannedDepartureDate: this.fb.control(null, Validators.required),
        plannedArrivalDate: this.fb.control(null, Validators.required),
        plannedDepartureTime: this.fb.control('', Validators.required),
        plannedArrivalTime: this.fb.control('', Validators.required),
      },
      { validators: this.departureBeforeArrivalValidator() }
    );
  }

  private departureBeforeArrivalValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const actualGroup = group as FormGroup<FlightDetailsForm>;

      const depDate = actualGroup.controls.plannedDepartureDate.value;
      const arrDate = actualGroup.controls.plannedArrivalDate.value;
      const depTime = actualGroup.controls.plannedDepartureTime.value;
      const arrTime = actualGroup.controls.plannedArrivalTime.value;
      const depDateStr = depDate?.toISOString().split('T')[0];
      const arrDateStr = arrDate?.toISOString().split('T')[0];

      if (depDateStr === arrDateStr) {
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
}
