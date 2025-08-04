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

export const DisruptiveMotive = {
  cancelation: "CANCELLATION",
  deniedBoarding: "DENIED_BOARDING",
  delay: "DELAY"
}

export const DeniedBoardingMotive = {
  overBooked: 'Flight overbooked',
  aggresive: 'Aggressive behavior with staff',
  intoxication: 'Intoxication',
  unspeciifed: 'Unspecified reason'
}

export const DisruptiveMotiveLabels: Record<DisruptiveMotive, string> = {
  [DisruptiveMotive.cancelation]: "Canceled",
  [DisruptiveMotive.deniedBoarding]: "Denied Boarding",
  [DisruptiveMotive.delay]: "Delayed"
};


export enum AirlineMotives {
  tehnical = 'Tehnical Problems',
  meteorological = 'Meteorological conditions',
  strike = 'Strike problems with airport',
  crew = 'Crew problems',
  other = 'Other motives'
}


export type DeniedBoardingMotive = typeof DeniedBoardingMotive[keyof typeof DeniedBoardingMotive];
export type DisruptiveMotive = typeof DisruptiveMotive[keyof typeof DisruptiveMotive]
