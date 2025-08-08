export enum DisruptiveMotive {
  cancelation = 'CANCELLATION',
  deniedBoarding = 'DENIED_BOARDING',
  delay = 'DELAY',
}

export enum CaseStatus {
  notAssigned = 'NOT_ASSIGNED',
  assigned = 'ASSIGNED',
  eligible = 'ELIGIBLE',
  notEligible = 'NOT_ELIGIBLE',
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
  lessThan14Days = 'Less than 14 days',
  moreThan14Days = 'More than 14 days',
  onFlightDay = 'On flight day',
}

export enum DelayNotice {
  lessThan3Hours = 'Less than 3 hours',
  moreThan3Hours = 'More than 3 hours',
  lostConnection = 'Lost connection',
}

export enum IsMotiveSpecified {
  yes = 'Yes',
  no = 'No',
  notSpecified = 'Not specified',
}
