import { Component, computed, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { toCamelCase, TranslocoPipe } from '@jsverse/transloco';
import { DisruptiveMotiveLabels } from '../../shared/types/types';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { DisruptiveFormService } from './service/disruptive-form.service';
import { MatSelectModule } from '@angular/material/select';
import { AirlineMotives, DeniedBoardingMotive, DisruptiveMotive } from '../../shared/enums';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';

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
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
  ],
  templateUrl: './disruptive-form.component.html',
  styleUrl: './disruptive-form.component.scss',
})
export class DisruptiveFormComponent implements OnInit, OnDestroy {
  public motives: string[];
  public reasons: DeniedBoardingMotive[] = Object.values(DeniedBoardingMotive);
  public airlineDeniedMotives: AirlineMotives[] = Object.values(AirlineMotives);
  private service = inject(DisruptiveFormService);
  private onDestroy$ = new Subject<void>();
  public readonly next = output<void>();
  protected readonly DisruptiveMotiveLabels = DisruptiveMotiveLabels;
  public isEligibile = signal<boolean>(false);
  public eligibleText = computed(() => (this.isEligibile() ? 'Eligible' : 'Not eligible'));

  constructor() {
    this.motives = Object.values(DisruptiveMotiveLabels);
  }

  public formDisruption = this.service.createForm();

  protected continue() {
    this.next.emit();
  }

  ngOnInit(): void {
    this.motives = Object.values(DisruptiveMotiveLabels);
    this.formDisruption.statusChanges.subscribe(() => {
      console.log(this.service.buildEligibilityRequest(this.formDisruption));
      this.service.checkEligibility(this.formDisruption).subscribe({
        next: (result) => {
          this.isEligibile.set(result);
        },
        error: (err) => {
          this.isEligibile.set(false);
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
