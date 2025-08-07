import { Component, EventEmitter, inject, OnInit, Output, output, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { MatLine } from '@angular/material/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Passenger } from '../../shared/types/types';
import { translate, TranslocoDirective } from '@jsverse/transloco';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';

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
    TranslocoDirective,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
  ],
  templateUrl: './documents-form.component.html',
  styleUrls: ['./documents-form.component.scss'],
})
export class DocumentsFormComponent implements OnInit {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected readonly documentsFormGroup = this.formBuilder.group<DocumentsForm>({
    files: this.formBuilder.control<File[]>([], [Validators.required]),
  });
  private readonly _isValid = signal(false);

  public readonly isValid = this._isValid.asReadonly();
  public readonly next = output<void>();
  public readonly previous = output<void>();

  @Output() receiveMessage = new EventEmitter<File[]>();

  passDataToParent()   {
    const data = this.getFormRaw;
    if (!data) return;
    this.receiveMessage.emit(data);
  }


  public get getFormRaw() {
    return this.documentsFormGroup.getRawValue().files;
  }

  ngOnInit() {
    this.documentsFormGroup.statusChanges.subscribe((status) => {
      this._isValid.set(status === 'VALID');
    });
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024;

    const existingFiles = this.documentsFormGroup.get('files')?.value || [];
    const newFiles = Array.from(input.files);

    const validFiles = newFiles.filter(
      (file) => allowedTypes.includes(file.type) && file.size <= maxSize
    );

    const mergedFiles = [...existingFiles, ...validFiles].filter(
      (file, index, self) =>
        self.findIndex((f) => f.name === file.name && f.size === file.size) === index
    );

    this.documentsFormGroup.get('files')?.setValue(mergedFiles);
    this.documentsFormGroup.get('files')?.markAsTouched();
  }

  protected removeFile(fileToRemove: File): void {
    const files = this.documentsFormGroup.get('files')?.value || [];
    const updatedFiles = files.filter((file: File) => file !== fileToRemove);
    this.documentsFormGroup.get('files')?.setValue(updatedFiles);
    this.documentsFormGroup.get('files')?.markAsTouched();
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
