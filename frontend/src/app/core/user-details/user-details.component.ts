import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  effect,
  EventEmitter,
  inject,
  output,
  Output,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDetailsForm } from '../../shared/types/form.types';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatCheckbox } from '@angular/material/checkbox';
import { PassengerDetailsFormComponent } from '../passenger-details-form/passenger-details-form.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { Passenger, UserDetails } from '../../shared/types/types';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-user-details',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatCardActions,
    MatError,
    TranslocoPipe,
    MatCheckbox,
    PassengerDetailsFormComponent,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  protected readonly next = output<void>();
  protected readonly previous = output<void>();
  protected http = inject(HttpClient);
  protected readonly dialog = inject(MatDialog);
  private authService = inject(AuthService);

  private loggedInSignal: Signal<boolean> = this.authService.loggedInSignal;
  public isValid = signal(false);
  public isValidPassengerDetails = signal(false);

  @ViewChild(PassengerDetailsFormComponent)
  passengerDetailsFormComponent!: PassengerDetailsFormComponent;

  public form = this.fb.group<UserDetailsForm>({
    email: this.fb.control('', [Validators.required, Validators.email]),
    registrationNo: this.fb.control('', Validators.required),
    firstName: this.fb.control('', Validators.required),
    lastName: this.fb.control('', Validators.required),
    isPassenger: this.fb.control(false),
  });

  @Output() receiveMessage = new EventEmitter<UserDetails>();
  @Output() receiveMessagePassenger = new EventEmitter<Passenger>();
  protected emailExists = signal(false);
  private readonly API_URL = environment.apiURL;
  private onDestroy$ = new Subject<void>();
  public showPassengerDetails = false;
  private cdr = inject(ChangeDetectorRef);

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  constructor() {
    effect(() => {
      const email = this.authService.getEmail;
      const firstName = this.authService.getFirstName;
      const lastName = this.authService.getLastName;
      if (this.loggedInSignal() && email && firstName && lastName) {
        this.form.controls.email.setValue(email);
        this.form.controls.email.disable();
        this.form.controls.firstName.setValue(firstName);
        this.form.controls.firstName.disable();
        this.form.controls.lastName.setValue(lastName);
        this.form.controls.lastName.disable();
      }
    });
  }

  ngAfterViewInit() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.form.statusChanges.subscribe((status) => {
      this.isValid.set(status === 'VALID');
    });
  }

  public get autoFillPassengerNames() {
    if (this.form.controls.isPassenger.value) {
      return {
        firstName: this.form.controls.firstName.value ?? '',
        lastName: this.form.controls.lastName.value ?? '',
      };
    }
    return undefined;
  }

  passDataToParent() {
    const userDetails = this.formRawValue;
    const passengerData = this.passengerDetailsFormComponent.getFormRaw;
    if (!userDetails?.email || !passengerData) return;

    this.receiveMessage.emit(userDetails);
    this.receiveMessagePassenger.emit(passengerData);
  }

  onEmailBlur() {
    const emailControl = this.form.controls.email;
    if (emailControl && emailControl.valid) {
      this.http
        .get<{
          exists: boolean;
        }>(this.API_URL + `/email-exists?email=${emailControl.value}`)
        .subscribe((response) => {
          if (response.exists) {
            this.form.controls.email.setErrors({ emailExists: true });
          } else {
            const errors = this.form.controls.email.errors;
            if (errors) {
              delete errors['emailExists'];
              this.form.controls.email.setErrors(Object.keys(errors));
            } else {
              this.form.controls.email.setErrors(null);
            }
          }
          this.emailExists.set(response.exists);
          this.cdr.detectChanges();
        });
    }
  }

  public get formRawValue(): UserDetails | undefined {
    const raw = this.form.getRawValue();
    if (!raw.email || !raw.firstName || !raw.lastName || !raw.registrationNo) return;

    return {
      email: raw.email,
      firstName: raw.firstName,
      lastName: raw.lastName,
      reservationNumber: raw.registrationNo,
    };
  }

  openDialog() {
    const email = this.form.controls.email.value;
    const dialogRef = this.dialog.open(LoginComponent, {
      autoFocus: false,
      width: '60%',
      height: '60%',
      data: { email, withRedirect: false },
      disableClose: true,
      panelClass: 'login-dialog-container',
    });
    dialogRef.componentInstance.dialogRef = dialogRef;
  }
  protected continueToSubmit() {
    this.passDataToParent();
    this.passengerDetailsFormComponent.passDataToParent();
    this.next.emit();
  }
  protected continueToPassengerDetails() {
    this.showPassengerDetails = true;
  }

  protected back() {
    this.previous.emit();
  }

  protected backToUserDetails() {
    this.showPassengerDetails = false;
  }

  protected readonly translate = translate;

  handleReceiveMessage(data: Passenger) {
    this.receiveMessagePassenger.emit(data);
  }
}
