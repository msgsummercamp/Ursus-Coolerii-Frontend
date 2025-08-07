import { Component, computed, inject, Signal, viewChild, ViewEncapsulation } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoDirective } from '@jsverse/transloco';
import { PassengerDetailsFormComponent } from '../../passenger-details-form/passenger-details-form.component';
import { DocumentsFormComponent } from '../../documents-form/documents-form.component';
import { FlightDetailsWrapComponent } from '../../layout/flight-details-wrap/flight-details-wrap.component';
import { DisruptiveFormComponent } from '../../disruptive-form/disruptive-form.component';
import { AirportsService } from '../../layout/flight-details-form/service/airport.service';
import { ConfirmationEligibilityComponent } from '../../confirmation-eligibility/confirmation-eligibility.component';
import {
  CaseData,
  CaseDataWithFiles,
  DisruptionDetails,
  Flight,
  Passenger, SignupRequest,
} from '../../../shared/types/types';
import { SaveService } from '../../../shared/services/save.service';
import { UserDetailsComponent } from '../../user-details/user-details.component';

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
    DisruptiveFormComponent,
    ConfirmationEligibilityComponent,
    UserDetailsComponent,
  ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class StepperComponent {
  protected airportService = inject(AirportsService);
  protected saveCaseService = inject(SaveService);

  private disruptiveFormComponent = viewChild(DisruptiveFormComponent);
  protected disruptiveFormCompleted: Signal<boolean | undefined> = computed(() =>
    this.disruptiveFormComponent()?.isEligibile()
  );
  private flightDetailsWrapComponent = viewChild(FlightDetailsWrapComponent);
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

  private userForm = viewChild(UserDetailsComponent);
  protected userFormCompleted: Signal<boolean | undefined> = computed(() =>
    this.userForm()?.isValid()
  );

  private disruptionDetails: DisruptionDetails | undefined;
  public receiveDisruptionDetails($event: DisruptionDetails) {
    this.disruptionDetails = $event;
  }

  private flight: Flight | undefined;
  public receiveFlight($event: Flight) {
    this.flight = $event;
  }

  private passenger: Passenger | undefined;
  public receivdePassenger($event: Passenger) {
    this.passenger = $event;
  }

  public documents: File[] | undefined;
  receiveDocuments($event: File[]) {
    this.documents = $event;
  }

  public userDetails: { email: string } | undefined;
  receiveUserDetails($event: {email: string }) {
    this.userDetails = $event;
  }

  public buildUserDetails(): SignupRequest | undefined {
    if (!this.userDetails || !this.passenger || !this.passenger.firstName || !this.passenger.lastName) return;
    const usr = {
      email: this.userDetails.email,
      firstName: this.passenger.firstName,
      lastName: this.passenger.lastName,
    };
    console.log("DATA" + usr);
    return usr;
  }

  public buildCaseFile(): CaseDataWithFiles | undefined {
    console.log(this.userDetails);
    if (
      !this.disruptionDetails ||
      !this.flight ||
      !this.passenger ||
      !this.documents ||
      !this.userDetails
    )
      return;
    return {
      caseData: {
        disruptionDetails: this.disruptionDetails,
        reservationNumber: 'mockReservation',
        flights: [this.flight],
        passenger: this.passenger,
        userEmail: this.userDetails.email,
      },
      files: this.documents,
    };
  }

  onStepChange(event: any) {
    if (event.selectedIndex === 1) {
      this.airportService.fetchAirports();
    }
  }
}
