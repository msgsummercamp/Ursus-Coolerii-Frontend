import { Component, inject } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { MatLine } from '@angular/material/core';

type DocumentsForm = {
  files: FormControl<File[]>;
};

@Component({
  selector: 'app-documents-form',
  imports: [
    ReactiveFormsModule,
    MatIcon,
    MatButton,
    MatError,
    MatListItem,
    MatList,
    MatLine,
    MatIconButton,
  ],
  templateUrl: './documents-form.component.html',
  styleUrls: ['./documents-form.component.scss'],
})
export class DocumentsFormComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected readonly documentsFormGroup = this.formBuilder.group<DocumentsForm>({
    files: this.formBuilder.control<File[]>([], [Validators.required]),
  });

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const existingFiles = this.documentsFormGroup.get('files')?.value || [];
      const newFiles = Array.from(input.files);
      const mergedFiles = [...existingFiles, ...newFiles].filter(
        (file, index, self) =>
          self.findIndex((f) => f.name === file.name && f.size === file.size) === index
      );
      this.documentsFormGroup.get('files')?.setValue(mergedFiles);
      this.documentsFormGroup.get('files')?.markAsTouched();
    }
  }

  protected removeFile(fileToRemove: File): void {
    const files = this.documentsFormGroup.get('files')?.value || [];
    const updatedFiles = files.filter((file: File) => file !== fileToRemove);
    this.documentsFormGroup.get('files')?.setValue(updatedFiles);
    this.documentsFormGroup.get('files')?.markAsTouched();
  }
}
