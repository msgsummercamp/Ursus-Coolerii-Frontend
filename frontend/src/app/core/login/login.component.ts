import { Component, inject, signal } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginForm } from '../../shared/types/form.types';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../shared/services/auth.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatLabel,
    MatInput,
    MatFormField,
    MatCardActions,
    MatButton,
    MatError,
    TranslocoPipe,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  protected form: FormGroup<LoginForm>;
  private loginService = inject(AuthService);
  router = inject(Router);

  protected loginError = signal('');

  constructor() {
    this.form = this.fb.group<LoginForm>({
      email: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required),
    });
  }

  public login() {
    this.loginService
      .login(this.form.controls.email.value, this.form.controls.password.value)
      .subscribe({
        next: (response) => {
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.loginError.set(err.error);
        },
      });
  }
}
