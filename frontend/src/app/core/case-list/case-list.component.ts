import { Component, inject, OnInit } from '@angular/core';
import { CaseService } from './service/case.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../shared/services/auth.service';
import { AuthorizationService } from '../../shared/services/authorization.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, NgClass, NgForOf } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CaseStatus } from '../../shared/enums';

@Component({
  selector: 'app-case-list',
  imports: [
    TranslocoPipe,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    RouterLink,
    NgForOf,
    NgClass,
    DatePipe,
    MatPaginator,
  ],
  templateUrl: './case-list.component.html',
  styleUrl: './case-list.component.scss',
})
export class CaseListComponent implements OnInit {
  cases;
  public statusList: CaseStatus[];
  private authService = inject(AuthService);
  private authorizationService = inject(AuthorizationService);
  private currentId: string | null;
  viewMode: 'grid' | 'table' = 'grid';
  selectedDate: Date | null = null;
  selectedStatus: CaseStatus | null = null;

  displayedColumns: string[] = [
    'contractId',
    'caseDate',
    'flightNr',
    'flightDepartureDate',
    'flightArrivalDate',
    'reservationNumber',
    'passengerName',
    'status',
    'colleague',
  ];

  constructor(protected caseService: CaseService) {
    if (this.authorizationService.hasRolePassenger(this.authService.sessionToken))
      this.currentId = this.authService.getId ?? null;
    else this.currentId = null;
    this.cases = this.caseService.casesSignal;
    this.statusList = Object.values(CaseStatus);
  }

  ngOnInit() {
    this.caseService.fetchCases(0, 5, this.currentId);
    this.statusList = Object.values(CaseStatus);
  }

  onPageChange(event: PageEvent) {
    this.caseService.fetchCases(event.pageIndex, event.pageSize, this.currentId);
  }

  filteredCases() {
    return this.cases().filter((c: any) => {
      const dateMatches =
        !this.selectedDate ||
        new Date(c.caseDate).toDateString() === this.selectedDate.toDateString();
      const statusMatches = !this.selectedStatus || c.status === this.selectedStatus;
      return dateMatches && statusMatches;
    });
  }

  clearFilters() {
    this.selectedDate = null;
    this.selectedStatus = null;
  }
}
