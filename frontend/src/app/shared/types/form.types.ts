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

export type UserDetailsForm = {
  email: FormControl<string | null>;
  registrationNo: FormControl<string | null>;
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
  disruptionMotive: FormControl<string | null>;
  daysBeforeCancellation: FormControl<string | null>;
  hoursLateArrival: FormControl<string | null>;
  gaveSeatVoluntarly: FormControl<string | null>;
  deniedBoardingMotive: FormControl<string | null>;
  airlineMentionedMotive: FormControl<string | null>;
  communicatedMotive: FormControl<string | null>;
  optionalComments: FormControl<string | null>;
};
