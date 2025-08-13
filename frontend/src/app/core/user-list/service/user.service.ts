import { User } from '../../../shared/types/types';
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, map, Observable, retry, Subject, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';

type UserState = {
  userList: User[];
  isLoading: boolean;
  totalUsers: number;
  pageIndex: number;
  pageSize: number;
};

const initialState: UserState = {
  userList: [],
  isLoading: false,
  totalUsers: 0,
  pageIndex: 0,
  pageSize: 5,
};

@Injectable({ providedIn: 'root' })
export class UserService {
  public isLoading = computed(() => this.userState().isLoading);
  private _fetchUsers$ = new Subject<{ pageIndex: number; pageSize: number }>();
  private readonly userState = signal(initialState);
  private httpClient = inject(HttpClient);

  private users$ = this._fetchUsers$.pipe(
    switchMap(({ pageIndex, pageSize }) =>
      this.fetchUsersFromApi(pageIndex, pageSize).pipe(finalize(() => this.setIsLoading(false)))
    ),
    retry(3)
  );

  public pageIndexSignal = computed(() => this.userState().pageIndex);
  public pageSizeSignal = computed(() => this.userState().pageSize);

  public usersSignal = toSignal(this.users$.pipe(map((res) => res.userList)), { initialValue: [] });
  public totalUsersSignal = computed(() => this.userState().totalUsers);

  public fetchUsers(pageIndex: number = 0, pageSize: number = 5) {
    this.setIsLoading(true);
    this._fetchUsers$.next({ pageIndex, pageSize });
  }

  private setIsLoading(isLoading: boolean) {
    this.userState.update((state) => ({ ...state, isLoading }));
  }

  private fetchUsersFromApi(pageIndex: number, pageSize: number) {
    return this.httpClient
      .get<{
        content: User[];
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
      }>(`${environment.apiURL}/users`, {
        params: {
          pageIndex: pageIndex.toString(),
          pageSize: pageSize.toString(),
        },
      })
      .pipe(
        map((res) => {
          const mappedUsers = res.content.map((u) => ({
            ...u,
            userId: u.id,
          }));
          this.userState.update((state) => ({
            ...state,
            userList: mappedUsers,
            totalUsers: res.totalElements,
            pageIndex: res.number,
            pageSize: res.size,
          }));
          return { userList: mappedUsers, total: res.totalElements };
        })
      );
  }
  public getPageIndex(): number {
    return this.userState().pageIndex;
  }

  public getPageSize(): number {
    return this.userState().pageSize;
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
