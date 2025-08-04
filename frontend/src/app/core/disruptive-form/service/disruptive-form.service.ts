import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup,  } from '@angular/forms';
import {
  DisruptiveMotive,
  DisruptiveMotiveLabels,
  EligibilityRequest,
} from '../../../shared/types/types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { DisruptiveMotiveForm } from '../../../shared/types/form.types';

@Injectable({
  providedIn: 'root'
})
export class DisruptiveFormService {
  private httpClient = inject(HttpClient);
  private fb = inject(FormBuilder);

  public createForm() : FormGroup<  DisruptiveMotiveForm> {
    return this.fb.group<DisruptiveMotiveForm>({
      disruptionMotive: this.fb.control(''),
      daysBeforeCancelation: this.fb.control(null),
      hasArrived: this.fb.control(null),
      hoursLateArrival: this.fb.control(null),
      gaveSeatVoluntarly: this.fb.control(''),
      deniedBoardingMotive: this.fb.control(''),
      airlineMentionedMotive: this.fb.control(null),
      communicatedMotive: this.fb.control(''),
      })
  }

  private getDisruptionMotive(form: FormGroup<DisruptiveMotiveForm>): DisruptiveMotive | null {
    const motiveLabel = form.controls.disruptionMotive.value;
    const entry = Object.entries(DisruptiveMotiveLabels).find(([key, label]) => label === motiveLabel);
    if (entry) {
      return String(entry[0]) as DisruptiveMotive;
    }
    return null;
  }


  public buildEligibilityRequest(form: FormGroup<DisruptiveMotiveForm>): EligibilityRequest {
    return {
      disruption: this.getDisruptionMotive(form),
      noticeDays: form.controls.daysBeforeCancelation.value ?? null,
      arrived: form.controls.hasArrived.value,
      delayHours: form.controls.hoursLateArrival.value ?? null,
      isVoluntarilyGivenUp: form.controls.gaveSeatVoluntarly.value !== 'No'
    };
  }

  public checkEligibility(form: FormGroup<DisruptiveMotiveForm>): Observable<Boolean> {
    return this.httpClient.post<Boolean>(
      environment.apiURL + '/case-files/eligibility',
      this.buildEligibilityRequest(form)
    );
  }
}
