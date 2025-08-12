import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CaseDetailsDTO } from '../../../shared/types/types';

@Injectable({
  providedIn: 'root',
})
export class CaseFileService {
  constructor(private http: HttpClient) {}

  calculateReward(caseFile: any): Observable<number> {
    return this.http.post<number>(
      'http://localhost:8080/api/case-files/calculate-reward',
      caseFile
    );
  }

  getCaseDetailsByCaseId(caseId: string) {
    return this.http.get<CaseDetailsDTO>(`http://localhost:8080/api/case-files/contract/${caseId}`);
  }
}
