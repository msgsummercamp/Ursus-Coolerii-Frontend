import { Component, computed, Signal, viewChild } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoDirective } from '@jsverse/transloco';
import { PassengerDetailsFormComponent } from '../../passenger-details-form/passenger-details-form.component';
import { FlightDetailsFormComponent } from '../../layout/flight-details-form/component/flight-details-form.component';

@Component({
  selector: 'app-stepper',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoDirective,
    PassengerDetailsFormComponent,
    FlightDetailsFormComponent,
  ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
})
export class StepperComponent {
  private flightDetailsForm = viewChild(FlightDetailsFormComponent);
  protected flightDetailsFormCompleted: Signal<boolean | undefined> = computed(() =>
    this.flightDetailsForm()?.isValid()
  );

  private passengerDetailsForm = viewChild(PassengerDetailsFormComponent);
  protected passengerDetailsFormCompleted: Signal<boolean | undefined> = computed(() =>
    this.passengerDetailsForm()?.isValid()
  );
}
