import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  output,
  signal,
} from '@angular/core';
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
import { TranslocoPipe } from '@jsverse/transloco';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatLabel } from '@angular/material/input';
import { PopUpGdprComponent } from '../pop-up-gdpr/pop-up-gdpr.component';
import { MatDialog } from '@angular/material/dialog';
import { toObservable } from '@angular/core/rxjs-interop';
import { LoadingSpinnerComponent } from '../loading-spinner/component/loading-spinner.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { CaseFileService } from '../layout/services/case-file.service';

@Component({
  selector: 'app-confirmation-eligibility-form',
  imports: [
    MatButtonModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCardTitle,
    FormsModule,
    MatError,
    MatCardSubtitle,
    MatLabel,
    TranslocoPipe,
    LoadingSpinnerComponent,
    MatCheckbox,
    ReactiveFormsModule,
  ],
  templateUrl: './confirmation-eligibility.component.html',
  styleUrl: './confirmation-eligibility.component.scss',
})
export class ConfirmationEligibilityComponent {
  private eligibilityService = inject(EligibilityService);
  private caseFileService = inject(CaseFileService);
  private saveService = inject(SaveService);

  public saveError = signal('');
  readonly dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  gdprForm: FormGroup<{
    gdpr: FormControl<boolean | null>;
    terms: FormControl<boolean | null>;
    marketing: FormControl<boolean | null>;
  }>;
  protected notCheckedText = signal('');

  protected isLoading = signal(false);
  private isLoading$ = toObservable(this.saveService.isLoading);

  constructor() {
    this.isLoading$.subscribe((loading) => {
      this.isLoading.set(loading);
    });

    this.gdprForm = this.fb.group<{
      gdpr: FormControl<boolean | null>;
      terms: FormControl<boolean | null>;
      marketing: FormControl<boolean | null>;
    }>({
      gdpr: this.fb.control(false, Validators.required),
      terms: this.fb.control(false, Validators.required),
      marketing: this.fb.control(false),
    });
  }

  @Output() disableStepper = new EventEmitter<void>();

  disableStep() {
    this.disableStepper.emit();
  }
  @Input() buildCaseFileFn!: () => CaseDataWithFiles | undefined;
  @Input() buildUserDetails!: () => SignupRequest | undefined;
  protected rewardMessage = this.caseFileService.getReward();
  public eligibleMessage = computed(() => {
    const isEligible = this.eligibilityService.eligibility();
    if (isEligible === null) return 'checking';
    return isEligible ? 'eligible' : 'notEligible';
  });
  public readonly previous = output<void>();
  protected saved = signal(false);

  protected back() {
    this.previous.emit();
  }

  public isEligible = computed(() => {
    return this.eligibilityService.eligibility() === true;
  });

  public email: string | undefined;
  public submit() {
    const userDetails = this.buildUserDetails();
    console.log('userDetails', userDetails);
    const createdCase = this.buildCaseFileFn();

    if (!createdCase || !userDetails) return;

    this.email = userDetails.email;

    const saveRequest: SaveRequest = {
      signupRequest: userDetails,
      caseRequest: createdCase.caseData,
    };

    if (this.gdprForm.controls.gdpr.value != true || this.gdprForm.controls.terms.value != true) {
      this.notCheckedText.set(
        'You have to agree with the terms and GDPR in order to submit your case!'
      );
      return;
    }
    this.notCheckedText.set('');

    this.saveService.saveCase(saveRequest, createdCase.files).subscribe({
      next: (response) => {
        this.saveError.set('');
        this.saved.set(true);
        this.disableStep();
      },
      error: (err) => {
        this.saveError.set('Error saving the case: ' + err.error);
      },
    });
  }

  openDialog() {
    this.dialog.open(PopUpGdprComponent, { autoFocus: false });
  }
}
