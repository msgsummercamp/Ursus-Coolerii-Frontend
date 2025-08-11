export enum DisruptiveMotive {
  cancelation = 'CANCELLATION',
  deniedBoarding = 'DENIED_BOARDING',
  delay = 'DELAY',
}

export enum DeniedBoardingMotive {
  overBooked = 'Flight overbooked',
  aggresive = 'Aggressive behavior with staff',
  intoxication = 'Intoxication',
  unspeciifed = 'Unspecified reason',
}

export enum AirlineMotives {
  tehnical = 'Tehnical Problems',
  meteorological = 'Meteorological conditions',
  strike = 'Strike problems with airport',
  airportProb = 'Airport problems',
  crew = 'Crew problems',
  other = 'Other motives',
}

export enum CancellationNotice {
  lessThan14Days = 'LESS_THAN_14',
  moreThan14Days = 'MORE_THAN_14',
  onFlightDay = 'ON_FLIGHT_DAY',
}

export enum DelayNotice {
  lessThan3Hours = 'LESS_THAN_3',
  moreThan3Hours = 'MORE_THAN_3',
  lostConnection = 'LOST_CONNECTION',
}

export enum IsMotiveSpecified {
  yes = 'Yes',
  no = 'No',
  notSpecified = 'Not specified',
}
