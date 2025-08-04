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

export type DisruptiveMotiveForm = {
  disruptionMotive:  FormControl<string | null>;
  daysBeforeCancelation:FormControl<string | null>;
  hoursLateArrival: FormControl<string | null>;
  gaveSeatVoluntarly: FormControl<string | null>;
  deniedBoardingMotive: FormControl<string | null>;
  airlineMentionedMotive: FormControl<string | null>;
  communicatedMotive: FormControl<string | null>;
}

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

export const DisruptiveMotive = {
  cancelation: 'Cancelation',
  delay: 'Delay',
  deniedBoarding: 'Denied Boarding'
} as const

export const DeniedBoardingMotive = {
  overBooked: 'Flight overbooked',
  aggresive: 'Aggressive behavior with staff',
  intoxication: 'Intoxication',
  unspeciifed: 'Unspecified reason'
} as const

export type DeniedBoardingMotive = typeof DeniedBoardingMotive[keyof typeof DeniedBoardingMotive];

export type DisruptiveMotive = typeof DisruptiveMotive[keyof typeof DisruptiveMotive]