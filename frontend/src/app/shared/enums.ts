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
  crew = 'Crew problems',
  other = 'Other motives',
}

export enum CancellationNotice {
  lessThan14Days = 'Less than 14 days',
  moreThan14Days = 'More than 14 days',
  onFlightDay = 'On flight day',
}
