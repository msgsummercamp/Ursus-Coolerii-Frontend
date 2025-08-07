import { Injectable, signal } from '@angular/core';
import { AirportAttributes } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class StopoverService {
  private readonly stopoverSignal = signal<AirportAttributes[]>([]);

  public get stopoverList() {
    return this.stopoverSignal.asReadonly();
  }

  public addStopover(stopover: AirportAttributes) {
    this.stopoverSignal.update((stopovers) => [...stopovers, stopover]);
  }

  public removeStopover(stopoverIndex: number) {
    this.stopoverSignal.update((stopovers) =>
      stopovers.filter((_, index) => index !== stopoverIndex)
    );
  }
}
