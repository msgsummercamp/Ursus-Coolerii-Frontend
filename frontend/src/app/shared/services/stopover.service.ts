import { Injectable, signal } from '@angular/core';
import { AirportAttributes } from '../types/types';

type StopoverState = {
  departureAirport: AirportAttributes;
  destinationAirport: AirportAttributes;
  stopovers: AirportAttributes[];
};

const initialState: StopoverState = {
  departureAirport: { name: '', iata: '' },
  destinationAirport: { name: '', iata: '' },
  stopovers: [],
};

@Injectable({
  providedIn: 'root',
})
export class StopoverService {
  private readonly stopoverSignal = signal<StopoverState>(initialState);

  public get stopoverState() {
    return this.stopoverSignal.asReadonly();
  }

  public addStopover(stopover: AirportAttributes) {
    this.stopoverSignal.update((stopoverState) => ({
      ...stopoverState,
      stopovers: [...stopoverState.stopovers, stopover],
    }));
  }

  public removeStopover(stopoverIndex: number) {
    this.stopoverSignal.update((stopoverState) => ({
      ...stopoverState,
      stopovers: this.filteredStopovers(stopoverIndex),
    }));
  }

  private filteredStopovers(stopoverIndex: number) {
    return this.stopoverSignal().stopovers.filter((_, index) => index !== stopoverIndex);
  }

  public setDepartureAirport(airport: AirportAttributes) {
    this.stopoverSignal.update((stopoverState) => ({
      ...stopoverState,
      departureAirport: airport,
    }));
  }

  public setDestinationAirport(airport: AirportAttributes) {
    this.stopoverSignal.update((stopoverState) => ({
      ...stopoverState,
      destinationAirport: airport,
    }));
  }
}
