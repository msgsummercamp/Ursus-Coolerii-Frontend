import { Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthorizationService } from '../services/authorization.service';

@Directive({
  selector: '[appEmployee]',
})
export class EmployeeDirective {
  private service = inject(AuthService);
  private authorizationService = inject(AuthorizationService);

  private isAuthenticated = this.service.loggedInSignal;
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
    effect(() => {
      this.updateView();
    });
  }

  private updateView() {
    const isEmployee = this.authorizationService.hasRoleEmployee(this.service.sessionToken);
    if (this.isAuthenticated() && !this.hasView && isEmployee) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
