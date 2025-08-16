import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize, map, Observable, retry, Subject, switchMap } from 'rxjs';
import { Case, User } from '../../../shared/types/types';
import { environment } from '../../../../environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../shared/services/auth.service';
import { AuthorizationService } from '../../../shared/services/authorization.service';
import { CaseStatus } from '../../../shared/enums';

type CaseState = {
  caseList: Case[];
  isLoading: boolean;
  totalCases: number;
  pageIndex: number;
  pageSize: number;
};

const initialState: CaseState = {
  caseList: [],
  isLoading: false,
  totalCases: 0,
  pageIndex: 0,
  pageSize: 5,
};

@Injectable({ providedIn: 'root' })
export class CaseService {
  private _fetchCases$ = new Subject<{
    pageIndex: number;
    pageSize: number;
    passengerId: string | null;
  }>();
  private readonly casesState = signal(initialState);
  private httpClient = inject(HttpClient);
  private cases$ = this._fetchCases$.pipe(
    switchMap(({ pageIndex, pageSize, passengerId }) =>
      this.fetchCasesFromApi(pageIndex, pageSize, passengerId).pipe(
        finalize(() => this.setIsLoading(false))
      )
    ),
    retry(3)
  );

  public casesSignal = toSignal(this.cases$.pipe(map((res) => res.caseList)), { initialValue: [] });
  public totalCasesSignal = computed(() => this.casesState().totalCases);

  private authService = inject(AuthService);
  private authorizationService = inject(AuthorizationService);

  public fetchCases(pageIndex: number = 0, pageSize: number = 5, passengerId: string | null) {
    this.setIsLoading(true);
    this._fetchCases$.next({ pageIndex, pageSize, passengerId });
  }

  private setIsLoading(isLoading: boolean) {
    this.casesState.update((state) => ({ ...state, isLoading }));
  }

  private fetchCasesFromApi(pageIndex: number, pageSize: number, passengerId: string | null) {
    let builtParams = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    if (passengerId) {
      builtParams = new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('passengerId', passengerId);
    }

    return this.httpClient
      .get<{
        content: Case[];
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
      }>(`${environment.apiURL}/case-files`, {
        params: builtParams,
        withCredentials: true,
      })
      .pipe(
        map((res) => {
          const mappedCases = res.content.map((caseFile) => ({
            ...caseFile,
            caseId: caseFile.caseId,
          }));
          this.casesState.update((state) => ({
            ...state,
            caseList: mappedCases,
            totalCases: res.totalElements,
            pageIndex: res.number,
            pageSize: res.size,
          }));
          return { caseList: mappedCases, total: res.totalElements };
        })
      );
  }

  public getPageIndex(): number {
    return this.casesState().pageIndex;
  }

  public getPageSize(): number {
    return this.casesState().pageSize;
  }

  public getEmployees() {
    return this.httpClient
      .get<{
        content: User[];
      }>(`${environment.apiURL}/users?pageIndex=0&pageSize=100`, { withCredentials: true })
      .pipe(map((res) => res.content.filter((u) => u.role.some((r) => r.name === 'EMPLOYEE'))));
  }

  public assignEmployee(caseId: string, employeeId: string): Observable<void> {
    return this.httpClient.put<void>(
      `${environment.apiURL}/case-files/${caseId}/assign-employee`,
      null,
      {
        params: { employeeId },
        withCredentials: true,
      }
    );
  }

  public updateCaseStatus(caseId: string, status: CaseStatus, employeeId: string | null) {
    return this.httpClient.patch<void>(
      `${environment.apiURL}/case-files/${caseId}/status?status=${status}${employeeId ? `&employeeId=${employeeId}` : ''}`,
      {},
      { withCredentials: true }
    );
  }
}
