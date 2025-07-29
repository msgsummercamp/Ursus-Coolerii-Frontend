import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';

type LogInForm = {
  username: FormControl<string>;
};

@Component({
  selector: 'app-form',
  imports: [
    MatButton,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatLabel,
    MatError,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly loginFormGroup = this.formBuilder.group<LogInForm>({
    username: this.formBuilder.control('', [Validators.required]),
  });
}
