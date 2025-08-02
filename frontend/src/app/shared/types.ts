import { FormControl } from '@angular/forms';

export type FlightDetailsForm = {
  flightNr: FormControl<string>;
  airline: FormControl<string>;
  departingAirport: FormControl<string>;
  destinationAirport: FormControl<string>;
  plannedDepartureDate: FormControl<Date | null>;
  plannedArrivalDate: FormControl<Date | null>;
  plannedDepartureTime: FormControl<string>;
  plannedArrivalTime: FormControl<string>;
};

export type PassengerDetailsForm = {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  dateOfBirth: FormControl<Date | null>;
  phoneNumber: FormControl<string>;
  address: FormControl<string>;
  postalCode: FormControl<string>;
};

export type AirportAttributes ={
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  latitude: string;
  longitude: string;
  altitude: number;
  timezone: string;
}
