import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../../../environments/environment";

export interface AirportAttributes {
    name : string;
    city : string;
    country : string;
    iata : string;
    icao : string;
    latitude : string;
    longitude : string;
    altitude : number;
    timezone : string;
}

@Injectable({ providedIn: 'root' })
export class AirportService {
    constructor(private http: HttpClient) {}

    getAirports(): Observable<AirportAttributes[]> {
        return this.http.get<AirportAttributes[]>(environment.apiURL+'/airports');
    }
}