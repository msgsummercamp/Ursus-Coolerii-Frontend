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

export enum Roles {
  passenger = 'PASSENGER',
  employee = 'EMPLOYEE',
  admin = 'ADMIN',
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
