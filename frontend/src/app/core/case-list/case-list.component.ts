import { Component, OnInit } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
// import { Case } from '../../shared/types/types';
import { DatePipe } from '@angular/common';
import { CaseService } from './service/case.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-case-list',
  imports: [
    MatTable,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    DatePipe,
    TranslocoPipe,
  ],
  templateUrl: './case-list.component.html',
  styleUrl: './case-list.component.scss',
})
export class CaseListComponent implements OnInit {
  cases;

  displayedColumns: string[] = [
    'caseId',
    'caseDate',
    'flightNr',
    'flightDepartureDate',
    'flightArrivalDate',
    'passengerName',
    'status',
    'colleague',
  ];

  constructor(private caseService: CaseService) {
    this.cases = this.caseService.casesSignal;
  }

  ngOnInit() {
    this.caseService.fetchCases();
    console.log('Cases loaded:', this.cases);
  }
}
