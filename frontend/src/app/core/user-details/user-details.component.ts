import { Component, EventEmitter, inject, OnInit, output, Output, signal } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDetailsForm } from '../../shared/types/form.types';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { translate } from '@jsverse/transloco';

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
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected readonly next = output<void>();
  protected readonly previous = output<void>();

  public isValid = signal(false);

  private messages = [
    'Already have an account? Click here to sign in',
    "Don't have an account? Click here to sign up",
  ];

  protected togglePageSignal = signal(false);
  protected togglePageMessage = signal(this.messages.at(0));

  public form = this.fb.group<UserDetailsForm>({
    email: this.fb.control('', Validators.required),
  });

  @Output() receiveMessage = new EventEmitter<{ email: string }>();

  ngOnInit() {
    this.form.statusChanges.subscribe((status) => {
      this.isValid.set(status === 'VALID');
    });
  }

  passDataToParent() {
    const data = this.formRawValue;
    if (!data?.email) return;

    this.receiveMessage.emit(data);
  }

  public get formRawValue(): { email: string } | undefined {
    const raw = this.form.getRawValue();
    if (!raw.email) return;

    return {
      email: raw.email,
    };
  }

  protected continue() {
    this.passDataToParent();
    this.next.emit();
  }

  protected back() {
    this.previous.emit();
  }

  protected readonly translate = translate;
}
