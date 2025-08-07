import { CaseStatus, DisruptiveMotive } from '../enums';

export type AirportAttributes = {
  name: string;
  iata: string;
};

export type EligibilityRequest = {
  disruption: DisruptiveMotive | null;
  noticeDays: number | null;
  arrived: boolean | null;
  delayHours: number | null;
  isVoluntarilyGivenUp: boolean | null;
};

export type Case = {
  caseId: string;
  caseDate: Date | string;
  flightNr: string;
  flightDepartureDate: Date | string;
  flightArrivalDate: Date | string;
  passengerName: string;
  status: CaseStatus;
  colleague?: string;
};

export const DisruptiveMotiveLabels: Record<DisruptiveMotive, string> = {
  [DisruptiveMotive.cancelation]: 'Canceled',
  [DisruptiveMotive.deniedBoarding]: 'Denied Boarding',
  [DisruptiveMotive.delay]: 'Delayed',
};
