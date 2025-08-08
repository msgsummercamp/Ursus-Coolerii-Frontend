import {
  AfterViewInit,
  Component,
  computed,
  inject,
  Signal,
  ViewChild,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoDirective } from '@jsverse/transloco';
import { PassengerDetailsFormComponent } from '../../passenger-details-form/passenger-details-form.component';
import { DocumentsFormComponent } from '../../documents-form/documents-form.component';
import { FlightDetailsWrapComponent } from '../../flight-details-wrap/flight-details-wrap.component';
import { DisruptiveFormComponent } from '../../disruptive-form/disruptive-form.component';
import { AirportsService } from '../../flight-details-form/service/airport.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ConfirmationEligibilityComponent } from '../../confirmation-eligibility/confirmation-eligibility.component';

const AIRPLANE_WIDTH = 40;
const VERTICAL_OFFSET = -19;

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
  ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('flyToStep', [
      transition(
        '* => *',
        [
          style({
            left: '{{fromLeft}}px',
            top: '{{fromTop}}px',
          }),
          animate(
            '400ms cubic-bezier(0.4,0.0,0.2,1)',
            style({
              left: '{{toLeft}}px',
              top: '{{toTop}}px',
            })
          ),
        ],
        { params: { fromLeft: 0, fromTop: 0, toLeft: 0, toTop: 0 } }
      ),
    ]),
  ],
})
export class StepperComponent implements AfterViewInit {
  protected airportService = inject(AirportsService);

  private disruptiveFormComponent = viewChild(DisruptiveFormComponent);
  protected disruptiveFormCompleted: Signal<boolean | undefined> = computed(() =>
    this.disruptiveFormComponent()?.isEligible()
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

  @ViewChild('stepper', { static: true }) stepper!: MatStepper;
  airplaneLeft = 0;
  airplaneTop = 0;
  activeStep = 0;
  isBackward = false;
  animationParams = {
    fromLeft: 0,
    fromTop: 0,
    toLeft: 0,
    toTop: 0,
  };
  stepHeaderPositions: { left: number; top: number }[] = [];

  ngAfterViewInit() {
    setTimeout(() => {
      this.cacheStepHeaderPositions();
      this.setInitialAirplanePosition();
    });
  }

  cacheStepHeaderPositions() {
    const headers = document.querySelectorAll('.mat-step-text-label');
    this.stepHeaderPositions = Array.from(headers).map((el) => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top + rect.height / 2 - VERTICAL_OFFSET,
      };
    });
  }

  setInitialAirplanePosition() {
    const headers = document.querySelectorAll('.mat-step-text-label');
    if (headers.length > 0) {
      const firstLabel = headers[0] as HTMLElement;
      const rect = firstLabel.getBoundingClientRect();
      this.animationParams = {
        fromLeft: rect.right,
        fromTop: rect.top + rect.height / 2 + VERTICAL_OFFSET,
        toLeft: rect.right,
        toTop: rect.top + rect.height / 2 + VERTICAL_OFFSET,
      };
      this.airplaneLeft = rect.right;
      this.airplaneTop = rect.top + rect.height / 2 + VERTICAL_OFFSET;
    }
  }

  onStepChange(event: any) {
    if (event.selectedIndex === 1) {
      this.airportService.fetchAirports();
    }
    const prevStep = this.activeStep;
    this.activeStep = event.selectedIndex;
    this.setAnimationParams(prevStep, this.activeStep);
    this.airplaneLeft = this.animationParams.fromLeft;
    this.airplaneTop = this.animationParams.fromTop;
  }

  setAnimationParams(from: number, to: number) {
    const headers = document.querySelectorAll('.mat-step-text-label');

    if (headers.length > from && headers.length > to) {
      const fromLabel = headers[from] as HTMLElement;
      const toLabel = headers[to] as HTMLElement;
      const fromRect = fromLabel.getBoundingClientRect();
      const toRect = toLabel.getBoundingClientRect();

      if (to > from) {
        this.isBackward = false;
        const icon = toLabel.closest('.mat-step-header')?.querySelector('.mat-step-icon');
        const iconRect = icon?.getBoundingClientRect();
        this.animationParams = {
          fromLeft: fromRect.right,
          fromTop: fromRect.top + fromRect.height / 2 + VERTICAL_OFFSET,
          toLeft: iconRect ? iconRect.left - AIRPLANE_WIDTH : toRect.left - AIRPLANE_WIDTH,
          toTop: iconRect
            ? iconRect.top + iconRect.height / 2 + VERTICAL_OFFSET
            : toRect.top + toRect.height / 2 + VERTICAL_OFFSET,
        };
      } else {
        this.isBackward = true;
        this.animationParams = {
          fromLeft: fromRect.left,
          fromTop: fromRect.top + fromRect.height / 2 + VERTICAL_OFFSET,
          toLeft: toRect.right,
          toTop: toRect.top + toRect.height / 2 + VERTICAL_OFFSET,
        };
      }
      return;
    }
  }

  onAnimationDone() {
    this.airplaneLeft = this.animationParams.toLeft;
    this.airplaneTop = this.animationParams.toTop;
  }
}
