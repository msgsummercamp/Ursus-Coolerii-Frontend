import { Component, computed, inject, Input, output, signal } from '@angular/core';
import { EligibilityService } from '../../shared/services/eligibility.service';
import { MatButtonModule } from '@angular/material/button';
import { CaseDataWithFiles, SaveRequest, SignupRequest } from '../../shared/types/types';
import { SaveService } from '../../shared/services/save.service';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { translate } from '@jsverse/transloco';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatError, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-confirmation-eligibility-form',
  imports: [
    MatButtonModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCheckbox,
    MatCardTitle,
    FormsModule,
    MatError,
    MatCardSubtitle,
    MatLabel,
  ],
  templateUrl: './confirmation-eligibility.component.html',
  styleUrl: './confirmation-eligibility.component.scss',
})
export class ConfirmationEligibilityComponent {
  private eligibilityService = inject(EligibilityService);
  private saveService = inject(SaveService);
  public saveError = signal('');

  @Input() buildCaseFileFn!: () => CaseDataWithFiles | undefined;
  @Input() buildUserDetails!: () => SignupRequest | undefined;
  @Input() rewardMessage!: string | undefined;
  public eligibleMessage = computed(() => {
    const isEligible = this.eligibilityService.eligibility();
    if (isEligible === null) return 'Checking...';
    return isEligible ? 'Passenger is eligible' : 'Passenger is not eligible';
  });

  public readonly previous = output<void>();
  protected saved = signal(false);

  protected back() {
    this.previous.emit();
  }

  public isEligible = computed(() => {
    return this.eligibilityService.eligibility() === true;
  });

  public submit() {
    const userDetails = this.buildUserDetails();
    const createdCase = this.buildCaseFileFn();

    if (!createdCase || !userDetails) return;

    const saveRequest: SaveRequest = {
      signupRequest: userDetails,
      caseRequest: createdCase.caseData,
    };

    this.saveService.saveCase(saveRequest, createdCase.files).subscribe({
      next: (response) => {
        this.saveError.set('');
        this.saved.set(true);
      },
      error: (err) => {
        this.saveError.set('Error saving the case: ' + err.error);
      },
    });
  }

  protected readonly translate = translate;

  public agreed = false;
}
