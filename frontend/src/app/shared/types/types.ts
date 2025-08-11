import { CancellationNotice, DelayNotice, DisruptiveMotive } from '../enums';

export type AirportAttributes = {
  name: string;
  iata: string;
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
