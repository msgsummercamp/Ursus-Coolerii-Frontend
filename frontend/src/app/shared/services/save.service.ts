import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SaveRequest } from '../types/types';
import { environment } from '../../../environments/environment';
import { finalize } from 'rxjs';
import { AuthService } from './auth.service';

type SaveState = {
  isLoading: boolean;
};

const initialState: SaveState = {
  isLoading: false,
};

@Injectable({
  providedIn: 'root',
})
export class SaveService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.apiURL;
  private authService = inject(AuthService);

  private readonly saveState = signal(initialState);

  public isLoading = computed(() => this.saveState().isLoading);

  public saveCase(saveRequest: SaveRequest, uploadedFiles: File[]) {
    this.setIsLoading(true);

    const formData: FormData = new FormData();
    const caseBlob = new Blob([JSON.stringify(saveRequest)], { type: 'application/json' });
    uploadedFiles.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('saveRequest', caseBlob);

    return this.http
      .post<string>(this.API_URL + '/case-files', formData, { withCredentials: true })
      .pipe(finalize(() => this.setIsLoading(false)));
  }

  private setIsLoading(isLoading: boolean) {
    this.saveState.update((state) => ({ ...state, isLoading }));
  }
}
