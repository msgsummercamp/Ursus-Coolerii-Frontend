import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, map, retry, Subject, switchMap } from 'rxjs';
import { Case } from '../../../shared/types/types';
import { environment } from '../../../../environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../shared/services/auth.service';
import { AuthorizationService } from '../../../shared/services/authorization.service';

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
  private _fetchCases$ = new Subject<{ pageIndex: number; pageSize: number }>();
  private readonly casesState = signal(initialState);
  private httpClient = inject(HttpClient);
  private cases$ = this._fetchCases$.pipe(
    switchMap(({ pageIndex, pageSize }) =>
      this.fetchCasesFromApi(pageIndex, pageSize).pipe(finalize(() => this.setIsLoading(false)))
    ),
    retry(3)
  );

  public casesSignal = toSignal(this.cases$.pipe(map((res) => res.caseList)), { initialValue: [] });
  public totalCasesSignal = computed(() => this.casesState().totalCases);

  private authService = inject(AuthService);
  private authorizationService = inject(AuthorizationService);

  public fetchCases(pageIndex: number = 0, pageSize: number = 5) {
    this.setIsLoading(true);
    this._fetchCases$.next({ pageIndex, pageSize });
  }

  private setIsLoading(isLoading: boolean) {
    this.casesState.update((state) => ({ ...state, isLoading }));
  }

  private fetchCasesFromApi(pageIndex: number, pageSize: number) {
    const token = this.authService.sessionToken;
    let params: any = {
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
    };

    if (this.authorizationService.hasRolePassenger(token)) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.passengerId) {
          params.passengerId = payload.passengerId;
        }
      } catch {}
    }

    return this.httpClient
      .get<{
        content: Case[];
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
      }>(`${environment.apiURL}/case-files`, {
        params: {
          pageIndex: pageIndex.toString(),
          pageSize: pageSize.toString(),
        },
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
}
