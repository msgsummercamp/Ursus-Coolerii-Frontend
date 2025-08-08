import { FormControl } from '@angular/forms';
import { AirportAttributes } from './types';

export type ReservationDetailsForm = {
  departingAirport: FormControl<string>;
  destinationAirport: FormControl<string>;
  plannedDepartureDate: FormControl<Date | null>;
  plannedArrivalDate: FormControl<Date | null>;
  stopover: FormControl<AirportAttributes>;
};

export type FlightDetailsForm = {
  flightNr: FormControl<string>;
  airline: FormControl<string>;
  departingAirport: FormControl<AirportAttributes>;
  destinationAirport: FormControl<AirportAttributes>;
  plannedDepartureDate: FormControl<Date | null>;
};

export type UserDetailsForm = {
  email: FormControl<string | null>;
}

export type PassengerDetailsForm = {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  dateOfBirth: FormControl<Date | null>;
  phoneNumber: FormControl<string>;
  address: FormControl<string>;
  postalCode: FormControl<string>;
};

export type DisruptiveMotiveForm = {
  disruptionMotive: FormControl<string | null>;
  daysBeforeCancelation: FormControl<number | null>;
  hoursLateArrival: FormControl<number | null>;
  gaveSeatVoluntarly: FormControl<string | null>;
  deniedBoardingMotive: FormControl<string | null>;
  airlineMentionedMotive: FormControl<boolean | null>;
  communicatedMotive: FormControl<string | null>;
};
