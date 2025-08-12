import { Injectable, signal } from '@angular/core';
import { AirportAttributes, Flight } from '../types/types';

type StopoverState = {
  departureAirport: AirportAttributes;
  destinationAirport: AirportAttributes;
  stopovers: AirportAttributes[];
  departureDate: Date | null;
  destinationDate: Date | null;
  flights: Flight[];
};

const emptyAirport: AirportAttributes = {
  name: '',
  iata: '',
};

const initialState: StopoverState = {
  departureAirport: emptyAirport,
  destinationAirport: emptyAirport,
  stopovers: [],
  departureDate: null,
  destinationDate: null,
  flights: [],
};

@Injectable({
  providedIn: 'root',
})
export class StopoverService {
  private readonly stopoverSignal = signal<StopoverState>(initialState);
  private readonly problemFlightSignal = signal<number>(0);

  public get stopoverState() {
    return this.stopoverSignal.asReadonly();
  }

  public get problemFlightIndex() {
    return this.problemFlightSignal.asReadonly();
  }

  public addStopover(stopover: AirportAttributes) {
    this.stopoverSignal.update((stopoverState) => ({
      ...stopoverState,
      stopovers: [...stopoverState.stopovers, stopover],
    }));
    this.generateFlights();
  }

  public removeStopover(stopoverIndex: number) {
    this.stopoverSignal.update((stopoverState) => ({
      ...stopoverState,
      stopovers: this.filteredStopovers(stopoverIndex),
    }));
    this.generateFlights();
  }

  private filteredStopovers(stopoverIndex: number) {
    return this.stopoverSignal().stopovers.filter((_, index) => index !== stopoverIndex);
  }

  public setDepartureAirport(airport: AirportAttributes) {
    this.stopoverSignal.update((stopoverState) => ({
      ...stopoverState,
      departureAirport: airport,
    }));
    this.generateFlights();
  }

  public setDestinationAirport(airport: AirportAttributes) {
    this.stopoverSignal.update((stopoverState) => ({
      ...stopoverState,
      destinationAirport: airport,
    }));
    this.generateFlights();
  }

  public setDepartureDate(date: Date | null) {
    this.stopoverSignal.update((stopoverState) => ({
      ...stopoverState,
      departureDate: date,
    }));
    this.setFlightDepartureDate(0, date);
  }

  public setDestinationDate(date: Date | null) {
    this.stopoverSignal.update((stopoverState) => ({
      ...stopoverState,
      destinationDate: date,
    }));
    this.setFlightArrivalDate(this.stopoverSignal().flights.length - 1, date);
  }

  public setFlightDepartureDate(flightIndex: number, date: Date | null) {
    this.stopoverSignal.update((stopoverState: StopoverState) => {
      const flights = [...stopoverState.flights];
      if (flights[flightIndex]) {
        flights[flightIndex] = {
          ...flights[flightIndex],
          departureTime: date?.toISOString() || '',
        };
      }
      return { ...stopoverState, flights };
    });
  }

  public setFlightArrivalDate(flightIndex: number, date: Date | null) {
    this.stopoverSignal.update((stopoverState: StopoverState) => {
      const flights = [...stopoverState.flights];
      if (flights[flightIndex]) {
        flights[flightIndex] = {
          ...flights[flightIndex],
          arrivalTime: date?.toISOString() || '',
        };
      }
      return { ...stopoverState, flights };
    });
  }

  public setProblemFlightIndex(i: number) {
    this.problemFlightSignal.set(i);
    this.stopoverSignal.update((stopoverState: StopoverState) => ({
      ...stopoverState,
      flights: stopoverState.flights.map((flight, index) => ({
        ...flight,
        problemFlight: i === index,
      })),
    }));
  }

  public generateFlights() {
    let flights: Flight[] = [];
    const airports = [
      this.stopoverSignal().departureAirport,
      ...this.stopoverSignal().stopovers,
      this.stopoverSignal().destinationAirport,
    ];

    for (let i = 0; i < airports.length - 1; i += 1) {
      let currentAirport = airports[i];
      let nextAirport = airports[i + 1];
      let newFlight: Flight = {
        departureAirport: currentAirport,
        destinationAirport: nextAirport,
        firstFlight: i === 0,
        lastFlight: i === airports.length - 2,
        problemFlight: this.problemFlightIndex() === i,
        flightNumber: '',
        airlineName: '',
        departureTime: i === 0 ? this.stopoverSignal().departureDate?.toISOString() || '' : '',
        arrivalTime:
          i === airports.length - 2
            ? this.stopoverSignal().destinationDate?.toISOString() || ''
            : '',
      };

      flights.push(newFlight);
    }

    this.stopoverSignal.update((stopoverState) => ({ ...stopoverState, flights: flights }));
  }

  setFlightNumber(flightIndex: number, flightNumber: string) {
    this.stopoverSignal.update((stopoverState: StopoverState) => {
      const flights = [...stopoverState.flights];
      if (flights[flightIndex]) {
        flights[flightIndex] = {
          ...flights[flightIndex],
          flightNumber: flightNumber,
        };
      }
      return { ...stopoverState, flights };
    });
  }

  setAirline(flightIndex: number, airline: string) {
    this.stopoverSignal.update((stopoverState: StopoverState) => {
      const flights = [...stopoverState.flights];
      if (flights[flightIndex]) {
        flights[flightIndex] = {
          ...flights[flightIndex],
          airlineName: airline,
        };
      }
      return { ...stopoverState, flights };
    });
  }
}
