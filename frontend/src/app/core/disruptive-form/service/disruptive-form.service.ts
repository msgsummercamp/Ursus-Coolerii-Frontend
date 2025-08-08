import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DisruptiveMotiveLabels, EligibilityRequest } from '../../../shared/types/types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { DisruptiveMotiveForm } from '../../../shared/types/form.types';
import { CancellationNotice, DelayNotice, DisruptiveMotive } from '../../../shared/enums';

@Injectable({
  providedIn: 'root',
})
export class DisruptiveFormService {
  private httpClient = inject(HttpClient);
  private fb = inject(FormBuilder);
  private daysBeforeNotice = 100;
  private hoursDelay = 0;

  public createForm(): FormGroup<DisruptiveMotiveForm> {
    return this.fb.group<DisruptiveMotiveForm>({
      disruptionMotive: this.fb.control(''),
      daysBeforeCancelation: this.fb.control(null),
      hoursLateArrival: this.fb.control(null),
      gaveSeatVoluntarly: this.fb.control(''),
      deniedBoardingMotive: this.fb.control(''),
      airlineMentionedMotive: this.fb.control(null),
      communicatedMotive: this.fb.control(''),
      optionalComments: this.fb.control(''),
    });
  }

  private getDisruptionMotive(form: FormGroup<DisruptiveMotiveForm>): DisruptiveMotive | null {
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
    if (
      form.controls.daysBeforeCancelation.value === CancellationNotice.lessThan14Days ||
      form.controls.daysBeforeCancelation.value === CancellationNotice.onFlightDay
    ) {
      this.daysBeforeNotice = 0;
    } else if (form.controls.daysBeforeCancelation.value === CancellationNotice.moreThan14Days) {
      this.daysBeforeNotice = 15;
    }
    if (
      form.controls.hoursLateArrival.value === DelayNotice.moreThan3Hours ||
      form.controls.hoursLateArrival.value === DelayNotice.lostConnection
    ) {
      this.hoursDelay = 4;
    } else if (form.controls.hoursLateArrival.value === DelayNotice.lessThan3Hours) {
      this.hoursDelay = 2;
    }
    return {
      disruption: this.getDisruptionMotive(form),
      noticeDays: this.daysBeforeNotice ?? null,
      delayHours: this.hoursDelay ?? null,
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
