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
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected readonly next = output<void>();
  protected readonly previous = output<void>();
  protected http = inject(HttpClient);

  public isValid = signal(false);

  public form = this.fb.group<UserDetailsForm>({
    email: this.fb.control('', Validators.required),
    registrationNo: this.fb.control('', Validators.required),
    firstName: this.fb.control('', Validators.required),
    lastName: this.fb.control('', Validators.required),
  });

  @Output() receiveMessage = new EventEmitter<{ email: string }>();
  protected emailExists = signal(false);
  private readonly API_URL = environment.apiURL;
  private onDestroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.form.controls.email.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((email) => this.isValidEmail(email)),
        switchMap((email) =>
          this.http.get<{ exists: boolean }>(this.API_URL + `/email-exists?email=${email}`)
        )
      )
      .subscribe((response) => {
        this.isValid.set(!response.exists);
        this.emailExists.set(response.exists);
      });
  }

  isValidEmail(email: string | null): boolean {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
