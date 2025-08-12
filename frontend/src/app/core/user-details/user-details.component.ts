import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  output,
  Output,
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

  public isValid = signal(false);
  public isValidPassengerDetails = signal(false);

  @ViewChild(PassengerDetailsFormComponent)
  passengerDetailsFormComponent!: PassengerDetailsFormComponent;

  public form = this.fb.group<UserDetailsForm>({
    email: this.fb.control('', Validators.required),
    registrationNo: this.fb.control('', Validators.required),
    firstName: this.fb.control('', Validators.required),
    lastName: this.fb.control('', Validators.required),
    isPassenger: this.fb.control(false),
  });

  @Output() receiveMessage = new EventEmitter<{
    email: string;
    firstName: string;
    lastName: string;
  }>();
  protected emailExists = signal(false);
  private readonly API_URL = environment.apiURL;
  private onDestroy$ = new Subject<void>();
  public showPassengerDetails = false;
  private cdr = inject(ChangeDetectorRef);

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngAfterViewInit() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.form.statusChanges.subscribe((status) => {
      this.isValid.set(status === 'VALID');
    });
  }

  isValidEmail(email: string | null): boolean {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    const data = this.formRawValue;
    if (!data?.email) return;

    this.receiveMessage.emit(data);
  }

  onEmailBlur() {
    const email = this.form.controls.email.value;
    if (this.isValidEmail(email)) {
      this.http
        .get<{ exists: boolean }>(this.API_URL + `/email-exists?email=${email}`)
        .subscribe((response) => {
          this.emailExists.set(response.exists);
          this.cdr.detectChanges();
        });
    }
  }

  public get formRawValue(): { firstName: string; lastName: string; email: string } | undefined {
    const raw = this.form.getRawValue();
    if (!raw.email) return;

    return {
      email: raw.email ?? '',
      firstName: raw.firstName ?? '',
      lastName: raw.lastName ?? '',
    };
  }

  protected continueToSubmit() {
    this.passDataToParent();
    this.passengerDetailsFormComponent.passDataToParent();
    console.log('User Details:', this.formRawValue);
    console.log('Passenger Details:', this.passengerDetailsFormComponent.getFormRaw);
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
}
