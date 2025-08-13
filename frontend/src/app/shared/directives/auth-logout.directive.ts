import { Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[showIfLoggedOut]',
})
export class AuthLogoutDirective {
  private authService = inject(AuthService);
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
    effect(() => {
      const loggedIn = this.authService.loggedInSignal();
      if (!loggedIn && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (loggedIn && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}
