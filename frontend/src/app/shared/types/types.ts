import { CancellationNotice, CaseStatus, DelayNotice, DisruptiveMotive } from '../enums';

export type AirportAttributes = {
  name: string;
  iata: string;
};

export type Case = {
  caseId: string;
  contractId: string;
  caseDate: Date | string;
  flightNr: string;
  flightDepartureDate: Date | string;
  flightArrivalDate: Date | string;
  reservationNumber: string;
  passengerName: string;
  status: CaseStatus;
  colleague?: string;
};

export type Role = {
  name: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role[];
  casesCount?: number;
};

export type Flight = {
  flightNumber: string;
  airlineName: string;
  departureAirport: AirportAttributes;
  destinationAirport: AirportAttributes;
  departureTime: string;
  arrivalTime: string;
  firstFlight: boolean;
  lastFlight: boolean;
  problemFlight: boolean;
};

export type Passenger = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
  postalCode: string;
};

export type DisruptionDetails = {
  disruption: DisruptiveMotive | null;
  noticeDays: string | null;
  delayHours: string | null;
  isVoluntarilyGivenUp: boolean | null;
};

export type CaseData = {
  disruptionDetails: DisruptionDetails;
  reservationNumber: string;
  flights: Flight[];
  passenger: Passenger;
  userEmail: string;
};

export type CaseDataWithFiles = {
  caseData: CaseData;
  files: File[];
};

export type SignupRequest = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type SaveRequest = {
  caseRequest: CaseData;
  signupRequest: SignupRequest;
};

export type EligibilityRequest = {
  disruption: DisruptiveMotive | null;
  noticeDays: CancellationNotice | null;
  delayHours: DelayNotice | null;
  isVoluntarilyGivenUp: boolean | null;
};

export const DisruptiveMotiveLabels: Record<DisruptiveMotive, string> = {
  [DisruptiveMotive.cancelation]: 'Canceled',
  [DisruptiveMotive.deniedBoarding]: 'Denied Boarding',
  [DisruptiveMotive.delay]: 'Delayed',
};

export const CancellationNoticeLabels: Record<CancellationNotice, string> = {
  [CancellationNotice.lessThan14Days]: 'Less than 14 days',
  [CancellationNotice.onFlightDay]: 'On flight day',
  [CancellationNotice.moreThan14Days]: 'More than 14 days',
};

export const DelayNoticeLabels: Record<DelayNotice, string> = {
  [DelayNotice.lessThan3Hours]: 'Less than 3 hours',
  [DelayNotice.moreThan3Hours]: 'More than 3 hours',
  [DelayNotice.lostConnection]: 'Lost connection',
};

export const CaseStatusLabels: Record<CaseStatus, string> = {
  [CaseStatus.notAssigned]: 'Not Assigned',
  [CaseStatus.assigned]: 'Assigned',
  [CaseStatus.eligible]: 'Won',
  [CaseStatus.notEligible]: 'Lost',
};

export interface FlightDetailsDTO {
  flightNumber: string;
  airline: string;
  departureAirport: string;
  destinationAirport: string;
  plannedDepartureTime: string;
  plannedArrivalTime: string;
  reservationNumber: string;
  connectingFlight: boolean;
}

export interface PassengerDTO {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  postalCode: string;
  email: string;
}

export interface DocumentDTO {
  filename: string;
  uploadTimestamp: string;
}

export interface CommentDTO {
  userEmail: string;
  userType: string;
  timestamp: string;
  content: string;
}

export interface CaseDetailsDTO {
  caseId: string;
  contractId: string;
  reservationNumber: string;
  flights: FlightDetailsDTO[];
  passenger: PassengerDTO;
  documents: DocumentDTO[];
  comments: CommentDTO[];
}

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    role: string;
  };
};

export type LoginRequest = {
  email: string;
  password: string;
};
