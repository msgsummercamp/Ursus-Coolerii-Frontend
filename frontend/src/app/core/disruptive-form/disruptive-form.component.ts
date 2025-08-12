import {
  Component,
  computed,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  output,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatOption } from '@angular/material/autocomplete';
import { toCamelCase, translate, TranslocoPipe } from '@jsverse/transloco';
import { DisruptionDetails, DisruptiveMotiveLabels } from '../../shared/types/types';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { DisruptiveFormService } from './service/disruptive-form.service';
import { MatSelectModule } from '@angular/material/select';
import {
  AirlineMotives,
  CancellationNotice,
  DelayNotice,
  DeniedBoardingMotive,
  DisruptiveMotive,
  IsMotiveSpecified,
} from '../../shared/enums';
import { EligibilityService } from '../../shared/services/eligibility.service';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-disruptive-form',
  imports: [
    MatLabel,
    MatOption,
    MatFormField,
    CommonModule,
    TranslocoPipe,
    MatOption,
    MatInput,
    ReactiveFormsModule,
    MatButton,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatTooltip,
  ],
  templateUrl: './disruptive-form.component.html',
  styleUrl: './disruptive-form.component.scss',
})
export class DisruptiveFormComponent implements OnInit, OnDestroy {
  @Output() receiveMessage = new EventEmitter<DisruptionDetails>();
  @Output() resetForms = new EventEmitter<void>();

  passDataToParent() {
    const data = this.getFormRaw;
    if (!data) return;
    this.receiveMessage.emit(data);
  }

  public motives: string[];
  public reasons: DeniedBoardingMotive[] = Object.values(DeniedBoardingMotive);
  public airlineDeniedMotives: AirlineMotives[] = Object.values(AirlineMotives);
  public cancellationNotice: CancellationNotice[] = Object.values(CancellationNotice);
  public delayNotice: DelayNotice[] = Object.values(DelayNotice);
  public isMotiveSpecified: string[];
  private service = inject(DisruptiveFormService);
  private onDestroy$ = new Subject<void>();
  public readonly next = output<void>();
  protected readonly DisruptiveMotiveLabels = DisruptiveMotiveLabels;
  protected readonly IsMotiveSpecified = IsMotiveSpecified;
  public isEligible = signal<boolean>(false);
  public eligibleText = computed(() => (this.isEligible() ? 'Eligible' : 'Not eligible'));
  private eligibilityService = inject(EligibilityService);

  constructor() {
    this.motives = Object.values(DisruptiveMotiveLabels);
    this.isMotiveSpecified = Object.values(IsMotiveSpecified);
  }

  public formDisruption = this.service.createForm();

  public get getFormRaw(): DisruptionDetails | null {
    const raw = this.formDisruption.getRawValue();

    const disruptiveMotive = this.service.getDisruptionMotive(this.formDisruption);
    const cancellationNotice = this.service.getCancellationNotice(this.formDisruption);
    const delayNotice = this.service.getDelayNotice(this.formDisruption);

    if (!disruptiveMotive) return null;

    return {
      disruption: disruptiveMotive,
      noticeDays: cancellationNotice,
      delayHours: delayNotice,
      isVoluntarilyGivenUp: raw.gaveSeatVoluntarly !== 'No',
    };
  }

  protected continue() {
    this.passDataToParent();
    this.next.emit();
  }

  protected reset() {
    Object.keys(this.formDisruption.controls).forEach((key) => {
      this.formDisruption.get(key)?.setValue('');
    });
    this.resetForms.emit();
  }

  ngOnInit(): void {
    this.motives = Object.values(DisruptiveMotiveLabels);
    this.formDisruption.controls.disruptionMotive.valueChanges.subscribe(() => {
      this.formDisruption.patchValue({
        daysBeforeCancellation: '',
        hoursLateArrival: '',
        gaveSeatVoluntarly: '',
        deniedBoardingMotive: '',
        airlineMentionedMotive: null,
        communicatedMotive: '',
        optionalComments: '',
      });
    });

    this.formDisruption.statusChanges.subscribe(() => {
      this.service.checkEligibility(this.formDisruption).subscribe({
        next: (result) => {
          this.isEligible.set(result.valueOf());
          this.eligibilityService.setEligibility(result.valueOf());
        },
        error: (err) => {
          this.isEligible.set(false);
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
  protected readonly translate = translate;
}
