import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseFileService } from '../layout/services/case-file.service';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { DatePipe, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { LoadingSpinnerComponent } from '../loading-spinner/component/loading-spinner.component';

@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss'],
  imports: [
    TranslocoPipe,
    DatePipe,
    NgForOf,
    FormsModule,
    MatListItem,
    MatSidenavContent,
    MatTabGroup,
    MatTab,
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatIcon,
    MatButton,
    LoadingSpinnerComponent,
  ],
})
export class CaseDetailsComponent implements OnInit {
  caseDetails: any;
  selectedSection: 'flights' | 'passenger' | 'documents' = 'flights';

  constructor(
    private route: ActivatedRoute,
    private caseFileService: CaseFileService,
    private router: Router
  ) {}

  ngOnInit() {
    const caseId = this.route.snapshot.paramMap.get('caseId');
    if (caseId) {
      this.caseFileService.getCaseDetailsByCaseId(caseId).subscribe({
        next: (data) => {
          this.caseDetails = data;
        },
        error: (err) => {
          ///TODO: unauthorized page
          this.router.navigate(['/home']);
        },
      });
    }
  }

  back() {
    this.router.navigate(['/cases']);
  }

  protected readonly translate = translate;
}
