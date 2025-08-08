import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DisruptiveMotiveLabels, EligibilityRequest } from '../../../shared/types/types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { DisruptiveMotiveForm } from '../../../shared/types/form.types';
import { DisruptiveMotive } from '../../../shared/enums';

@Injectable({
  providedIn: 'root',
})
export class DisruptiveFormService {
  private httpClient = inject(HttpClient);
  private fb = inject(FormBuilder);

  public createForm(): FormGroup<DisruptiveMotiveForm> {
    return this.fb.group<DisruptiveMotiveForm>({
      disruptionMotive: this.fb.control(''),
      daysBeforeCancelation: this.fb.control(null),
      hoursLateArrival: this.fb.control(null),
      gaveSeatVoluntarly: this.fb.control(''),
      deniedBoardingMotive: this.fb.control(''),
      airlineMentionedMotive: this.fb.control(null),
      communicatedMotive: this.fb.control(''),
    });
  }

  public getDisruptionMotive(form: FormGroup<DisruptiveMotiveForm>): DisruptiveMotive | null {
    const motiveLabel = form.controls.disruptionMotive.value;
    const entry = Object.entries(DisruptiveMotiveLabels).find(
      ([key, label]) => label === motiveLabel
    );
    if (entry) {
      return String(entry[0]) as DisruptiveMotive;
    }
    return null;
  }

  public buildEligibilityRequest(form: FormGroup<DisruptiveMotiveForm>): EligibilityRequest {
    return {
      disruption: this.getDisruptionMotive(form),
      noticeDays: form.controls.daysBeforeCancelation.value ?? null,
      delayHours: form.controls.hoursLateArrival.value ?? null,
      isVoluntarilyGivenUp: form.controls.gaveSeatVoluntarly.value !== 'No',
    };
  }

  public checkEligibility(form: FormGroup<DisruptiveMotiveForm>): Observable<boolean> {
    return this.httpClient.post<boolean>(
      environment.apiURL + '/case-files/eligibility',
      this.buildEligibilityRequest(form)
    );
  }
}
