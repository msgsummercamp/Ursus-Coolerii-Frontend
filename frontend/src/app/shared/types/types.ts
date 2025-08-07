import { DisruptiveMotive } from '../enums';

export type AirportAttributes = {
  name: string;
  iata: string;
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
