import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseFileService } from '../layout/services/case-file.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
  ],
})
export class CaseDetailsComponent implements OnInit {
  caseDetails: any;

  constructor(
    private route: ActivatedRoute,
    private caseFileService: CaseFileService
  ) {}

  ngOnInit() {
    const caseId = this.route.snapshot.paramMap.get('caseId');
    if (caseId) {
      this.caseFileService.getCaseDetailsByCaseId(caseId).subscribe((data) => {
        this.caseDetails = data;
        if (this.caseDetails?.flights) {
          this.caseDetails.flights = [...this.caseDetails.flights].reverse();
        }
      });
    }
  }
}
