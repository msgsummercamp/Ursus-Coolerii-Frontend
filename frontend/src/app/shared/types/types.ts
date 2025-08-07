import { DisruptiveMotive } from '../enums';

export type AirportAttributes ={
  name: string;
  iata: string;
}

export type Flight = {
  flightNumber: string;
  airlineName: string;
  departureAirport: string;
  destinationAirport: string;
  departureTime: string;
  arrivalTime: string;
  firstFlight: boolean;
  lastFlight: boolean;
  problemFlight: boolean;

}

export type Passenger = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
  postalCode: string;
}

export type DisruptionDetails = {
  disruption: DisruptiveMotive | null;
  noticeDays: number | null;
  arrived: boolean | null;
  delayHours: number | null;
  isVoluntarilyGivenUp: boolean | null;
}


export type CaseData = {
  disruptionDetails: DisruptionDetails;
  reservationNumber: string;
  flights: Flight[];
  passenger: Passenger;
  userEmail: string;
}

export type CaseDataWithFiles = {
  caseData: CaseData,
  files: File[]
}

export type SignupRequest = {
  email: string,
  firstName: string,
  lastName: string
}

export type SaveRequest = {
  caseRequest: CaseData,
  signupRequest: SignupRequest
}

export type EligibilityRequest= {
  disruption: DisruptiveMotive | null,
  noticeDays: number | null,
  arrived: boolean | null,
  delayHours: number | null,
  isVoluntarilyGivenUp: boolean | null
}


export const DisruptiveMotiveLabels: Record<DisruptiveMotive, string> = {
  [DisruptiveMotive.cancelation]: "Canceled",
  [DisruptiveMotive.deniedBoarding]: "Denied Boarding",
  [DisruptiveMotive.delay]: "Delayed"
};

