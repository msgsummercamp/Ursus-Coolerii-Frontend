import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDetailsForm } from '../../shared/types/form.types';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Passenger } from '../../shared/types/types';

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
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  private fb = inject(FormBuilder);


  private messages = [
    "Already have an account? Click here to sign in",
    "Don't have an account? Click here to sign up"
  ]

  protected togglePageSignal = signal(false);
  protected togglePageMessage = signal(this.messages.at(0))

  public form = this.fb.group<UserDetailsForm>({
    email: this.fb.control('', Validators.required),
    password: this.fb.control('')
  });

  @Output() receiveMessage = new EventEmitter<{email: string}>();

  passDataToParent() {
    const data = this.formRawValue;
    if (!data.email) return;
    this.receiveMessage.emit({email: data.email });
  }

  public get formRawValue() {
    return this.form.getRawValue();
  }

  public toggleAuthPage() {
    const currentValue = this.togglePageSignal();
    this.togglePageSignal.set(!currentValue);

    if(!currentValue) {
      this.form.controls.password.setValidators([Validators.required]);
    }
    else {
      this.form.controls.password.clearValidators();
      this.form.controls.password.setValue('');
    }

    this.form.controls.password.updateValueAndValidity();

  }
}
