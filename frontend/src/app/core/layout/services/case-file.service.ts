import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
}
