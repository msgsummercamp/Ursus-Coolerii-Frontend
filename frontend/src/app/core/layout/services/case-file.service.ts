import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CaseFileService {
  private reward = signal<number>(0);

  constructor(private http: HttpClient) {}

  public calculateReward(departureAirport: string, destinationAirport: string): void {
    console.log(departureAirport);
    this.http
      .post<number>('http://localhost:8080/api/case-files/calculate-reward', {
        departureAirport: departureAirport,
        destinationAirport: destinationAirport,
      })
      .pipe(
        tap((value) => {
          this.reward.set(value);
        })
      )
      .subscribe({
        error: (error) => {
          console.error('Error calculating reward:', error);
        },
      });
  }

  public getReward() {
    return this.reward.asReadonly();
  }
}
