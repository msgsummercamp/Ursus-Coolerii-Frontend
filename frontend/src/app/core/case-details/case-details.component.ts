import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseFileService } from '../layout/services/case-file.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss'],
  imports: [
    TranslocoPipe,
    DatePipe,
    NgIf,
    NgForOf,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
  ],
})
export class CaseDetailsComponent implements OnInit {
  caseDetails: any;

  constructor(
    private route: ActivatedRoute,
    private caseFileService: CaseFileService
  ) {}

  ngOnInit() {
    const contractId = this.route.snapshot.paramMap.get('contractId');
    if (contractId) {
      this.caseFileService.getCaseDetailsByContractId(contractId).subscribe((data) => {
        this.caseDetails = data;
      });
    }
  }
}
