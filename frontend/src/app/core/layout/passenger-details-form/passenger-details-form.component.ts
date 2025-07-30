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
import { MatButton } from '@angular/material/button';

type PassengerDetailsForm = {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  dateOfBirth: FormControl<Date>;
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
    MatButton,
  ],
  templateUrl: './passenger-details-form.component.html',
  styleUrl: './passenger-details-form.component.scss',
})
export class PassengerDetailsFormComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected readonly passengerDetailsForm = this.formBuilder.group<PassengerDetailsForm>({
    firstName: this.formBuilder.control('', Validators.required),
    lastName: this.formBuilder.control('', Validators.required),
    dateOfBirth: this.formBuilder.control<Date>(new Date(), Validators.required),
    phoneNumber: this.formBuilder.control('', Validators.required),
    address: this.formBuilder.control('', Validators.required),
    postalCode: this.formBuilder.control('', Validators.required),
  });

  protected onFormSubmit(): void {
    if (this.passengerDetailsForm.valid) {
      const formData = this.passengerDetailsForm.getRawValue();
      console.log('Form submitted successfully:', formData);
    } else {
      console.error('Form is invalid');
    }
  }
}
