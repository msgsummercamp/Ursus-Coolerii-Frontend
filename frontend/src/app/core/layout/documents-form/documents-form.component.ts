import { Component, inject } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { MatFormField, MatLabel } from '@angular/material/input';

type DocumentsForm = {
  files: FormControl<NgxFileDropEntry[]>;
};

@Component({
  selector: 'app-documents-form',
  imports: [NgxFileDropModule, ReactiveFormsModule, MatFormField, MatLabel],
  templateUrl: './documents-form.component.html',
})
export class DocumentsFormComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected readonly documentsFormGroup = this.formBuilder.group<DocumentsForm>({
    files: this.formBuilder.control<NgxFileDropEntry[]>([], [Validators.required]),
  });
}
