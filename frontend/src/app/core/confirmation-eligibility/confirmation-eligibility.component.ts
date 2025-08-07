import { Component, computed, inject, Input, output } from '@angular/core';
import { EligibilityService } from '../../shared/services/eligibility.service';
import { MatButtonModule } from '@angular/material/button';
import { CaseDataWithFiles, SaveRequest, SignupRequest } from '../../shared/types/types';
import { SaveService } from '../../shared/services/save.service';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { translate } from '@jsverse/transloco';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

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
  ],
  templateUrl: './confirmation-eligibility.component.html',
  styleUrl: './confirmation-eligibility.component.scss',
})
export class ConfirmationEligibilityComponent {
  private eligibilityService = inject(EligibilityService);
  private saveService = inject(SaveService);

  @Input() buildCaseFileFn!: () => CaseDataWithFiles | undefined;
  @Input() buildUserDetails!: () => SignupRequest | undefined;
  public eligibleMessage = computed(() => {
    const isEligible = this.eligibilityService.eligibility();
    if (isEligible === null) return 'Checking...';
    return isEligible ? 'Passenger is eligible' : 'Passenger is not eligible';
  });

  public readonly previous = output<void>();

  protected back() {
    this.previous.emit();
  }

  public isEligible = computed(() => {
    return this.eligibilityService.eligibility() === true;
  });

  public submit() {
    const userDetails = this.buildUserDetails();
    const createdCase = this.buildCaseFileFn();

    console.log(userDetails);
    console.log(createdCase);
    if (!createdCase || !userDetails) return;

    const saveRequest: SaveRequest = {
      signupRequest: userDetails,
      caseRequest: createdCase.caseData,
    };

    this.saveService.saveCase(saveRequest, createdCase.files);
  }

  protected readonly translate = translate;

  public agreed = false;

  onCheckboxClicked() {
    this.agreed = !this.agreed;
  }
}
