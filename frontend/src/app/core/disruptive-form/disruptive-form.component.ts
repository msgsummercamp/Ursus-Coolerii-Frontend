import { Component, inject, OnDestroy, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatHint, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  type AirportAttributes,
  DeniedBoardingMotive,
  DisruptiveMotive,
  DisruptiveMotiveForm,
} from '../../shared/types';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { DisruptiveFormService } from './service/disruptive-form.service';

@Component({
  selector: 'app-diruptive-form',
  imports: [
    MatLabel,
    MatAutocomplete,
    MatOption,
    MatFormField,
    MatAutocompleteTrigger,
    CommonModule,
    TranslocoPipe,
    MatOption,
    MatInput,
    ReactiveFormsModule,
    MatButton,
  ],
  templateUrl: './disruptive-form.component.html',
  styleUrl: './disruptive-form.component.scss',
})
export class DisruptiveFormComponent implements OnInit, OnDestroy {
  public motives: DisruptiveMotive[] = Object.values(DisruptiveMotive);
  public days: string[] = ['Less than 14 days', 'More than 14 days'];
  public hours: string[] = ['Less than 3 hours', 'More than 3 hours'];
  public reasons: DeniedBoardingMotive[] = Object.values(DeniedBoardingMotive);
  protected readonly DisruptiveMotive = DisruptiveMotive;
  private service = inject(DisruptiveFormService);
  public filteredMotives: string[] = this.motives;
  public filteredDays: string[] = this.days;
  public filteredHours: string[] = this.hours;
  public filteredDeniedReason: string[] = this.reasons;
  private onDestroy$ = new Subject<void>();
  public readonly next = output<void>();


  public formDisruption = this.service.createForm();

  protected continue() {
    this.next.emit();
  }

  ngOnInit(): void {
    this.subscribeAllFormFields();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private subscribeAllFormFields(): void {
    this.subscribeFormControlToFilter(
      this.formDisruption.controls.disruptionMotive,
      'filteredMotives',
      this.motives
    );
    this.subscribeFormControlToFilter(
      this.formDisruption.controls.daysBeforeCancelation,
      'filteredDays',
      this.days
    );
    this.subscribeFormControlToFilter(
      this.formDisruption.controls.hoursLateArrival,
      'filteredHours',
      this.hours
    );
    this.subscribeFormControlToFilter(
      this.formDisruption.controls.deniedBoardingMotive,
      'filteredDeniedReason',
      this.reasons
    );
  }

  private subscribeFormControlToFilter(
    control: FormControl<string | null>,
    property: 'filteredMotives' | 'filteredDays' | 'filteredHours' | 'filteredDeniedReason',
    allValues: string[]
  ) {
    control.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((value) => {
      this[property] = this.filterArray(allValues, value);
    });
  }

  private filterArray(arrayToFilter: string[], value: string | null): string[] {
    const filtered = (value || '').toLowerCase();
    return arrayToFilter.filter((f) => f.toLowerCase().includes(filtered));
  }
}
