import { computed, inject, Injectable, signal } from '@angular/core';
import { AirportAttributes } from '../../../../shared/types/types';
import { finalize, retry, Subject, switchMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, shareReplay } from 'rxjs';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AirportAttributes } from '../../../shared/types/types';
import { FlightDetailsForm } from '../../../shared/types/form.types';
type AirportsState = {
  airportList: AirportAttributes[];
  isLoading: boolean;
};

const initialState: AirportsState = {
  airportList: [],
  isLoading: false,
};

@Injectable({
  providedIn: 'root',
})
export class AirportsService {
  public isLoading = computed(() => this.airportState().isLoading);

  private _fetchAirport$ = new Subject<void>();

  private readonly airportState = signal(initialState);

  private httpClient = inject(HttpClient);
  private fb = inject(NonNullableFormBuilder);
  private readonly _airportList: Observable<AirportAttributes[]> | undefined;

  private airports$ = this._fetchAirport$.pipe(
    switchMap(() => this.fetchAirportsFromApi().pipe(finalize(() => this.setIsLoading(false)))),
    retry(3)
  );

  public airportsSignal = toSignal(this.airports$, { initialValue: [] });

  public fetchAirports() {
    this.setIsLoading(true);
    this._fetchAirport$.next();
  }

  private setIsLoading(isLoading: boolean) {
    this.airportState.update((state) => ({ ...state, isLoading }));
  }

  private fetchAirportsFromApi() {
    return this.httpClient.get<AirportAttributes[]>(environment.apiURL + '/airports').pipe();
  }
}
