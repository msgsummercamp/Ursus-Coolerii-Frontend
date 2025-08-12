import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  public createForm(): FormGroup<DisruptiveMotiveForm> {
    return this.fb.group<DisruptiveMotiveForm>({
      disruptionMotive: this.fb.control('', Validators.required),
      daysBeforeCancellation: this.fb.control(''),
      hoursLateArrival: this.fb.control(''),
      gaveSeatVoluntarly: this.fb.control(''),
      deniedBoardingMotive: this.fb.control(''),
      airlineMentionedMotive: this.fb.control(null),
      communicatedMotive: this.fb.control(''),
      optionalComments: this.fb.control(''),
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

  public getCancellationNotice(form: FormGroup<DisruptiveMotiveForm>): CancellationNotice | null {
    const noticeLabel = form.controls.daysBeforeCancellation.value;
    if (
      noticeLabel &&
      Object.values(CancellationNotice).includes(noticeLabel as CancellationNotice)
    ) {
      return noticeLabel as CancellationNotice;
    }
    return null;
  }

  public getDelayNotice(form: FormGroup<DisruptiveMotiveForm>): DelayNotice | null {
    const delayLabel = form.controls.hoursLateArrival.value;
    if (delayLabel && Object.values(DelayNotice).includes(delayLabel as DelayNotice)) {
      return delayLabel as DelayNotice;
    }
    return null;
  }

  public buildEligibilityRequest(form: FormGroup<DisruptiveMotiveForm>): EligibilityRequest {
    return {
      disruption: this.getDisruptionMotive(form),
      noticeDays: this.getCancellationNotice(form),
      delayHours: this.getDelayNotice(form),
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
