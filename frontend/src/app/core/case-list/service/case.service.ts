import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable, retry, Subject, switchMap } from 'rxjs';
import { Case } from '../../../shared/types/types';
import { environment } from '../../../../environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';

type CaseState = {
  caseList: Case[];
  isLoading: boolean;
};

const initialState: CaseState = {
  caseList: [],
  isLoading: false,
};

@Injectable({ providedIn: 'root' })
export class CaseService {
  public isLoading = computed(() => this.casesState().isLoading);
  private _fetchCases$ = new Subject<void>();
  private readonly casesState = signal(initialState);
  private httpClient = inject(HttpClient);
  private cases$ = this._fetchCases$.pipe(
    switchMap(() => this.fetchCasesFromApi().pipe(finalize(() => this.setIsLoading(false)))),
    retry(3)
  );

  public casesSignal = toSignal(this.cases$, { initialValue: [] });

  public fetchCases() {
    this.setIsLoading(true);
    this._fetchCases$.next();
  }

  private setIsLoading(isLoading: boolean) {
    this.casesState.update((state) => ({ ...state, isLoading }));
  }

  private fetchCasesFromApi() {
    return this.httpClient.get<Case[]>(environment.apiURL + '/case-files');
  }
}
