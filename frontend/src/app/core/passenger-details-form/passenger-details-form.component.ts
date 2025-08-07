import { Component, EventEmitter, inject, OnInit, Output, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { PassengerDetailsForm } from '../../shared/types/form.types';
import { Flight, Passenger } from '../../shared/types/types';

@Component({
  selector: 'app-passenger-details-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatHint,
    MatSuffix,
    MatButton,
    TranslocoDirective,
  ],
  templateUrl: './passenger-details-form.component.html',
  styleUrl: './passenger-details-form.component.scss',
})
export class PassengerDetailsFormComponent implements OnInit {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly _isValid = signal(false);

  protected readonly currentDate = new Date();

  public readonly passengerDetailsForm = this.formBuilder.group<PassengerDetailsForm>({
    firstName: this.formBuilder.control('', Validators.required),
    lastName: this.formBuilder.control('', Validators.required),
    dateOfBirth: this.formBuilder.control(null, Validators.required),
    phoneNumber: this.formBuilder.control('', [Validators.required, Validators.pattern('^[0-9]*')]),
    address: this.formBuilder.control('', Validators.required),
    postalCode: this.formBuilder.control('', [Validators.required, Validators.pattern('^[0-9]*')]),
  });

  public readonly isValid = this._isValid.asReadonly();
  public readonly next = output<void>();
  public readonly previous = output<void>();
  @Output() receiveMessage = new EventEmitter<Passenger>();

  passDataToParent() {
    const data = this.getFormRaw;
    if (!data) return;
    this.receiveMessage.emit(data);
  }

  ngOnInit() {
    this.passengerDetailsForm.statusChanges.subscribe((status) => {
      this._isValid.set(status === 'VALID');
    });
  }

  public get getFormRaw(): Passenger | null {
    const raw = this.passengerDetailsForm.getRawValue();

    if(!raw.dateOfBirth)
      return null;

    return {
      firstName: raw.firstName,
      lastName: raw.lastName,
      dateOfBirth: raw.dateOfBirth,
      phoneNumber: raw.phoneNumber,
      address: raw.address,
      postalCode: raw.postalCode,
    }
  }

  protected continue() {
    this.passDataToParent();
    this.next.emit();
  }

  protected back() {
    this.previous.emit();
  }
}
