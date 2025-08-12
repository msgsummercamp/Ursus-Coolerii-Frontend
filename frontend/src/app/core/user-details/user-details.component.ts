import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  output,
  Output,
  signal,
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

  public form = this.fb.group<UserDetailsForm>({
    email: this.fb.control('', Validators.required),
    registrationNo: this.fb.control('', Validators.required),
    firstName: this.fb.control('', Validators.required),
    lastName: this.fb.control('', Validators.required),
    isPassenger: this.fb.control(false),
  });

  @Output() receiveMessage = new EventEmitter<{ email: string }>();
  protected emailExists = signal(false);
  private readonly API_URL = environment.apiURL;
  private onDestroy$ = new Subject<void>();
  public showPassengerDetails = false;

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
        });
    }
  }

  public get formRawValue(): { email: string } | undefined {
    const raw = this.form.getRawValue();
    if (!raw.email) return;

    return {
      email: raw.email,
    };
  }

  protected continueToSubmit() {
    this.passDataToParent();
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
