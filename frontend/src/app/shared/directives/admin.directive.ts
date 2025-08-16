import { Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthorizationService } from '../services/authorization.service';

@Directive({
  selector: '[appAdmin]',
})
export class AdminDirective {
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
    const isAdmin = this.authorizationService.hasRoleAdmin(this.service.sessionToken);
    if (this.isAuthenticated() && !this.hasView && isAdmin) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
