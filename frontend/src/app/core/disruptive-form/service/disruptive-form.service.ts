import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DisruptiveMotiveForm, FlightDetailsForm } from '../../../shared/types';

@Injectable({
  providedIn: 'root'
})
export class DisruptiveFormService {

  private fb = inject(FormBuilder);

  public createForm() : FormGroup<DisruptiveMotiveForm> {
    return this.fb.group<DisruptiveMotiveForm>({
      disruptionMotive: this.fb.control(''),
      daysBeforeCancelation: this.fb.control(''),
      hoursLateArrival: this.fb.control(''),
      gaveSeatVoluntarly: this.fb.control(''),
      deniedBoardingMotive: this.fb.control(''),
      airlineMentionedMotive: this.fb.control(''),
      communicatedMotive: this.fb.control(''),
      },
      { validators: this.validateForm });

  }

  public validateForm(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const actualGroup = group as FormGroup<DisruptiveMotiveForm>;


      return null;
    };
    }


}
