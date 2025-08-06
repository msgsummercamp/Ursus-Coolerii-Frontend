import { Component, computed, inject } from '@angular/core';
import { DisruptiveFormComponent } from '../disruptive-form/disruptive-form.component';
import { EligibilityService } from '../../shared/services/eligibility.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-eligibility-form',
  imports: [DisruptiveFormComponent, MatButtonModule],
  templateUrl: './confirmation-eligibility.component.html',
  styleUrl: './confirmation-eligibility.component.scss',
})
export class ConfirmationEligibilityComponent {
  private eligibilityService = inject(EligibilityService);

  public eligibleMessage = computed(() => {
    const isEligible = this.eligibilityService.eligibility();
    if (isEligible === null) return 'Checking...';
    return isEligible ? 'Passenger is eligible' : 'Passenger is not eligible';
  });

  public isEligible = computed(() => {
    return this.eligibilityService.eligibility() === true;
  });
}
