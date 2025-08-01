import { FormControl, FormArray } from '@angular/forms';

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
