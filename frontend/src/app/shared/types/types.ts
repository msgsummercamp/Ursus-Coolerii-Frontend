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
