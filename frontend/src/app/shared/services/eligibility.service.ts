import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EligibilityService {
  private _eligibility = signal<boolean | null>(null);
  readonly eligibility = this._eligibility.asReadonly();
  setEligibility(value: boolean) {
    this._eligibility.set(value);
  }
}
