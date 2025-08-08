import { CaseStatus, DisruptiveMotive } from '../enums';

export type AirportAttributes = {
  name: string;
  iata: string;
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

export type EligibilityRequest = {
  disruption: DisruptiveMotive | null;
  noticeDays: number | null;
  delayHours: number | null;
  isVoluntarilyGivenUp: boolean | null;
};

export const DisruptiveMotiveLabels: Record<DisruptiveMotive, string> = {
  [DisruptiveMotive.cancelation]: 'Canceled',
  [DisruptiveMotive.deniedBoarding]: 'Denied Boarding',
  [DisruptiveMotive.delay]: 'Delayed',
};

export const CaseStatusLabels: Record<CaseStatus, string> = {
  [CaseStatus.notAssigned]: 'Not Assigned',
  [CaseStatus.assigned]: 'Assigned',
  [CaseStatus.eligible]: 'Eligible',
  [CaseStatus.notEligible]: 'Not Eligible',
};
