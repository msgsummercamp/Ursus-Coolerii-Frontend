import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface AirlineAttributes {
  id: number;
  iata: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AirlineService {
  private httpClient = inject(HttpClient);
  private readonly _airlineList: Observable<AirlineAttributes[]> | undefined;

  constructor() {
    this._airlineList = this.httpClient.get<AirlineAttributes[]>(environment.apiURL + '/airlines');
  }

  get airLineList(): Observable<AirlineAttributes[]> | undefined {
    return this._airlineList;
  }
}
