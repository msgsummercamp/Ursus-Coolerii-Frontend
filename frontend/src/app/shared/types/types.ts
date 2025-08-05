import { DisruptiveMotive } from '../enums';

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

