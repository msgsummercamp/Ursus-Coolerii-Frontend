import { User } from '../../../shared/types/types';
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, map, Observable, retry, Subject, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';

type UserState = {
  userList: User[];
  isLoading: boolean;
};

const initialState: UserState = {
  userList: [],
  isLoading: false,
};

@Injectable({ providedIn: 'root' })
export class UserService {
  public isLoading = computed(() => this.userState().isLoading);
  private _fetchUsers$ = new Subject<void>();
  private readonly userState = signal(initialState);
  private httpClient = inject(HttpClient);
  private users$ = this._fetchUsers$.pipe(
    switchMap(() => this.fetchUsersFromApi().pipe(finalize(() => this.setIsLoading(false)))),
    retry(3)
  );

  public usersSignal = toSignal(this.users$, { initialValue: [] });

  public fetchUsers() {
    this.setIsLoading(true);
    this._fetchUsers$.next();
  }

  private setIsLoading(isLoading: boolean) {
    this.userState.update((state) => ({ ...state, isLoading }));
  }

  private fetchUsersFromApi() {
    return this.httpClient.get<User[]>(environment.apiURL + '/users').pipe(
      map((users) =>
        users.map((u) => ({
          ...u,
          userId: u.id,
        }))
      )
    );
  }

  deleteUser(userId: string): Observable<void> {
    return this.httpClient.delete<void>(`/users/${userId}`);
  }

  getUser(userId: string | null): Observable<any> {
    return this.httpClient.get<User>(`/users/${userId}`);
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>(`/users/${user.id}`, user);
  }
}
