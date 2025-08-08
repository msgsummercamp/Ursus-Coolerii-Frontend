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
import { DatePipe } from '@angular/common';
import { CaseService } from './service/case.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { CaseStatusLabels } from '../../shared/types/types';

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
  public statusList: string[];
  protected readonly CaseStatusLabels = CaseStatusLabels;

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

  constructor(private caseService: CaseService) {
    this.cases = this.caseService.casesSignal;
    this.statusList = Object.values(CaseStatusLabels);
  }

  ngOnInit() {
    this.caseService.fetchCases();
    this.statusList = Object.values(CaseStatusLabels);
  }
}
