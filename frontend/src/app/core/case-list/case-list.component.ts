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
import { MatDialog } from '@angular/material/dialog';
import { CaseStatus } from '../../shared/enums';
import { User } from '../../shared/types/types';
import { EmployeeDirective } from '../../shared/directives/employee.directive';
import { AdminDirective } from '../../shared/directives/admin.directive';
import { StatusSelectorDialogComponent } from '../status-selector/status-selector.component';

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
    EmployeeDirective,
    AdminDirective,
  ],
  templateUrl: './case-list.component.html',
  styleUrl: './case-list.component.scss',
})
export class CaseListComponent implements OnInit {
  cases;
  public statusList: CaseStatus[];
  private authService = inject(AuthService);
  private authorizationService = inject(AuthorizationService);
  private readonly currentId: string | null;
  viewMode: 'grid' | 'table' = 'grid';
  selectedDate: Date | null = null;
  selectedStatus: CaseStatus | null = null;
  employees: User[] = [];
  selectedEmployee: { [caseId: string]: string } = {};
  public selectedEmployeeFilter: string | null = null;
  showMyCases = false;
  private dialog = inject(MatDialog);

  get displayedColumns(): string[] {
    const baseColumns = [
      'contractId',
      'caseDate',
      'flightNr',
      'flightDepartureDate',
      'flightArrivalDate',
      'reservationNumber',
      'passengerName',
      'status',
    ];
    return this.hasAnyColleague() ? [...baseColumns, 'colleague'] : baseColumns;
  }

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
    this.caseService.getEmployees().subscribe((users) => {
      this.employees = users;
    });
  }

  onPageChange(event: PageEvent) {
    this.caseService.fetchCases(event.pageIndex, event.pageSize, this.currentId);
  }

  get loggedInEmployeeId(): string | null {
    return this.authService.getId ?? null;
  }

  toggleMyCases() {
    this.showMyCases = !this.showMyCases;
  }

  public filteredCases() {
    let cases = this.cases();

    if (this.selectedEmployeeFilter) {
      const selectedEmp = this.employees.find((e) => e.id === this.selectedEmployeeFilter);
      if (selectedEmp) {
        const fullName = `${selectedEmp.firstName} ${selectedEmp.lastName}`;
        cases = cases.filter((c: any) => c.colleague === fullName);
      }
    }

    let loggedInEmployeeName: string | null = null;
    if (this.loggedInEmployeeId && this.employees.length > 0) {
      const loggedEmployee = this.employees.find((e) => e.id === this.loggedInEmployeeId);
      if (loggedEmployee) {
        loggedInEmployeeName = `${loggedEmployee.firstName} ${loggedEmployee.lastName}`;
      }
    }

    if (this.showMyCases && loggedInEmployeeName) {
      cases = cases.filter((c: any) => c.colleague === loggedInEmployeeName);
    }

    const dateMatches = (c: any) =>
      !this.selectedDate ||
      new Date(c.caseDate).toDateString() === this.selectedDate.toDateString();
    const statusMatches = (c: any) => !this.selectedStatus || c.status === this.selectedStatus;
    return cases.filter((c: any) => dateMatches(c) && statusMatches(c));
  }

  public clearFilters() {
    this.selectedDate = null;
    this.selectedStatus = null;
    this.selectedEmployeeFilter = null;
  }

  assignEmployee(caseId: string) {
    const employeeId = this.selectedEmployee[caseId];
    if (!employeeId) return;
    this.caseService.assignEmployee(caseId, employeeId).subscribe(() => {
      this.caseService.fetchCases(
        this.caseService.getPageIndex(),
        this.caseService.getPageSize(),
        this.currentId
      );
    });
  }

  public hasAnyColleague() {
    return this.filteredCases().some((c) => !!c.colleague);
  }

  changeStatus(caseId: string, status: CaseStatus) {
    const employeeId = this.loggedInEmployeeId;
    this.caseService
      .updateCaseStatus(caseId, status, status === 'NOT_ASSIGNED' ? null : employeeId)
      .subscribe(() => {
        this.caseService.fetchCases(
          this.caseService.getPageIndex(),
          this.caseService.getPageSize(),
          this.currentId
        );
      });
  }

  public get isPassenger(): boolean {
    return this.authorizationService.hasRolePassenger(this.authService.sessionToken);
  }

  public caseAssignedToLoggedEmployee(caseObj: any): boolean {
    if (!caseObj.colleague || !this.loggedInEmployeeId || this.employees.length === 0) return false;
    const loggedEmployee = this.employees.find((e) => e.id === this.loggedInEmployeeId);
    if (!loggedEmployee) return false;
    const fullName = `${loggedEmployee.firstName} ${loggedEmployee.lastName}`;
    return caseObj.colleague === fullName;
  }

  openStatusDialog(caseObj: any) {
    let statusOptions: CaseStatus[] = [];

    if (this.authorizationService.hasRoleAdmin(this.authService.sessionToken)) {
      statusOptions = caseObj.colleague
        ? [CaseStatus.eligible, CaseStatus.notEligible, CaseStatus.notAssigned]
        : [CaseStatus.notAssigned];
    } else if (this.caseAssignedToLoggedEmployee(caseObj)) {
      statusOptions = [CaseStatus.eligible, CaseStatus.notEligible];
    }

    this.dialog
      .open(StatusSelectorDialogComponent, {
        data: { statusOptions },
      })
      .afterClosed()
      .subscribe((selectedStatus: CaseStatus) => {
        if (selectedStatus && selectedStatus !== caseObj.status) {
          this.changeStatus(caseObj.caseId, selectedStatus);
        }
      });
  }
}
