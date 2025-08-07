import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CaseData, SaveRequest } from '../types/types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaveService {

  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.apiURL;



  public saveCase(saveRequest : SaveRequest, uploadedFiles: File[]) : void {
    const formData: FormData = new FormData();

    const caseBlob = new Blob([JSON.stringify(saveRequest)], { type: 'application/json' });
    uploadedFiles.forEach(file => {
      formData.append('files', file);
    });

    formData.append('saveRequest', caseBlob);

    this.http.post<string>(this.API_URL + '/case-files', formData).subscribe(response => {
      console.log('Case saved:', response);
    });  }

}
