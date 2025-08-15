import { Component, Inject, inject, Optional, signal } from '@angular/core';
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
import { MatButton, MatIconButton } from '@angular/material/button';
import { AuthService } from '../../shared/services/auth.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

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
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  protected form: FormGroup<LoginForm>;
  private loginService = inject(AuthService);
  router = inject(Router);
  private withRedirect: boolean = true;
  public dialogRef!: MatDialogRef<LoginComponent>;

  protected loginError = signal('');

  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { email: string; withRedirect: boolean },
    @Optional() dialogRef: MatDialogRef<LoginComponent>
  ) {
    this.dialogRef = dialogRef!;
    this.form = this.fb.group<LoginForm>({
      email: this.fb.control(data?.email ?? '', Validators.required),
      password: this.fb.control('', Validators.required),
    });
    if (!data || !data.withRedirect == null) {
      return;
    }
    this.withRedirect = data.withRedirect;
  }

  isInDialog(): boolean {
    return !!this.dialogRef;
  }

  //TODO: fix error bad credentials handling
  public login() {
    this.loginService
      .login(this.form.controls.email.value, this.form.controls.password.value)
      .subscribe({
        next: (response) => {
          if (!response) {
            this.loginError.set('Bad credentials');
            return;
          }
          if (this.withRedirect) {
            this.router.navigate(['/home']);
          } else if (this.dialogRef) {
            this.dialogRef.close();
          }
        },
        error: (err) => {
          this.loginError.set(err.error);
        },
      });
  }
}
