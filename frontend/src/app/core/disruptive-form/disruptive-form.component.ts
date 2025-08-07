import { Component, computed, EventEmitter, inject, OnDestroy, OnInit, Output, output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { toCamelCase, TranslocoPipe } from '@jsverse/transloco';
import { DisruptionDetails, DisruptiveMotiveLabels } from '../../shared/types/types';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { DisruptiveFormService } from './service/disruptive-form.service';
import { MatSelectModule } from '@angular/material/select';
import { AirlineMotives, DeniedBoardingMotive, DisruptiveMotive } from '../../shared/enums';
import { EligibilityService } from '../../shared/services/eligibility.service';

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
    MatSelectModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './disruptive-form.component.html',
  styleUrl: './disruptive-form.component.scss',
})
export class DisruptiveFormComponent implements OnInit, OnDestroy {
  @Output() receiveMessage = new EventEmitter<DisruptionDetails>();

  passDataToParent() {
    const data = this.getFormRaw;
    if(!data)
      return;
    this.receiveMessage.emit(data);
  }

  public motives: string[];
  public reasons: DeniedBoardingMotive[] = Object.values(DeniedBoardingMotive);
  public airlineDeniedMotives: AirlineMotives[] = Object.values(AirlineMotives);
  private service = inject(DisruptiveFormService);
  private onDestroy$ = new Subject<void>();
  public readonly next = output<void>();
  protected readonly DisruptiveMotiveLabels = DisruptiveMotiveLabels;
  public isEligibile = signal<boolean>(false);
  public eligibleText = computed(() => (this.isEligibile() ? 'Eligible' : 'Not eligible'));
  private eligibilityService = inject(EligibilityService);

  constructor() {
    this.motives = Object.values(DisruptiveMotiveLabels);
  }

  public formDisruption = this.service.createForm();

  public get getFormRaw(): DisruptionDetails | null {
    const raw = this.formDisruption.getRawValue();

    const disruptiveMotive = this.service.getDisruptionMotive(this.formDisruption);

    if(!disruptiveMotive)
      return null;

    return {
      disruption: disruptiveMotive,
      noticeDays: raw.daysBeforeCancelation,
      arrived: raw.hasArrived,
      delayHours: raw.hoursLateArrival,
      isVoluntarilyGivenUp: raw.gaveSeatVoluntarly !== 'No',
    }
  }

  protected continue() {
    this.passDataToParent();
    this.next.emit();
  }

  ngOnInit(): void {
    this.motives = Object.values(DisruptiveMotiveLabels);
    this.formDisruption.statusChanges.subscribe(() => {
      this.service.checkEligibility(this.formDisruption).subscribe({
        next: (result) => {
          this.isEligibile.set(result.valueOf());
          this.eligibilityService.setEligibility(result.valueOf());
        },
        error: (err) => {
          this.isEligibile.set(false);
          this.eligibilityService.setEligibility(false);
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  protected readonly toCamelCase = toCamelCase;
  protected readonly DisruptiveMotive = DisruptiveMotive;
}
