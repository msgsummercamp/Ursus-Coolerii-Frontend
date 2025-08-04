import { ViewEncapsulation, Component, computed, Signal, viewChild, ViewChild } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoDirective } from '@jsverse/transloco';
import { PassengerDetailsFormComponent } from '../../passenger-details-form/passenger-details-form.component';
import { DocumentsFormComponent } from '../../documents-form/documents-form.component';
import { FlightDetailsWrapComponent } from '../../layout/flight-details-wrap/flight-details-wrap.component';

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
    FlightDetailsWrapComponent,
    DocumentsFormComponent,
    FlightDetailsWrapComponent,
  ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class StepperComponent {
  private flightDetailsWrapComponent = viewChild(FlightDetailsWrapComponent);
  private flightDetailsForm = this.flightDetailsWrapComponent()?.form;
  protected flightDetailsFormCompleted: Signal<boolean | undefined> = computed(() =>
    this.flightDetailsWrapComponent()?.validForms()
  );
  private passengerDetailsForm = viewChild(PassengerDetailsFormComponent);
  protected passengerDetailsFormCompleted: Signal<boolean | undefined> = computed(() =>
    this.passengerDetailsForm()?.isValid()
  );

  private documentsForm = viewChild(DocumentsFormComponent);
  protected documentsFormCompleted: Signal<boolean | undefined> = computed(() =>
    this.documentsForm()?.isValid()
  );
}
