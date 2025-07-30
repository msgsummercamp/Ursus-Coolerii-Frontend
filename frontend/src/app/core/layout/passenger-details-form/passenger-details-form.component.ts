import { Component, inject } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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

type PassengerDetailsForm = {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  dateOfBirth: FormControl<Date | null>;
  phoneNumber: FormControl<string>;
  address: FormControl<string>;
  postalCode: FormControl<string>;
};

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
  ],
  templateUrl: './passenger-details-form.component.html',
  styleUrl: './passenger-details-form.component.scss',
})
export class PassengerDetailsFormComponent {
  private readonly _formBuilder = inject(NonNullableFormBuilder);
  protected readonly passengerDetailsForm = this._formBuilder.group<PassengerDetailsForm>({
    firstName: this._formBuilder.control('', Validators.required),
    lastName: this._formBuilder.control('', Validators.required),
    dateOfBirth: this._formBuilder.control<Date | null>(null, Validators.required),
    phoneNumber: this._formBuilder.control('', Validators.required),
    address: this._formBuilder.control('', Validators.required),
    postalCode: this._formBuilder.control('', Validators.required),
  });

  onFormSubmit(): void {
    if (this.passengerDetailsForm.valid) {
      const formData = this.passengerDetailsForm.getRawValue();
      console.log('Form submitted successfully:', formData);
      // Here you can handle the form submission, e.g., send data to a server
    } else {
      console.error('Form is invalid');
    }
  }
}
