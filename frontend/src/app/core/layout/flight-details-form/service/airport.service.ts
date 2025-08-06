import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AirportAttributes } from '../../../../shared/types/types';
import { FlightDetailsForm } from '../../../../shared/types/form.types';

@Injectable({ providedIn: 'root' })
export class AirportService {
  private httpClient = inject(HttpClient);
  private fb = inject(NonNullableFormBuilder);
  private _airportList: Observable<AirportAttributes[]> | undefined;

  constructor() {
    this._airportList = this.httpClient
      .get<AirportAttributes[]>(environment.apiURL + '/airports')
      .pipe(shareReplay(1));
  }

  get airportList(): Observable<AirportAttributes[]> | undefined {
    return this._airportList;
  }

  public departureBeforeArrivalValidator(): ValidatorFn {
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

  public createForm() {
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
}
