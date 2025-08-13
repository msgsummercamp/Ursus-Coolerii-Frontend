import { computed, Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[showIfLogged]',
})
export class AuthDirectiveLogin {
  private service = inject(AuthService);

  private isAuthenticated = computed(() => this.service.loggedInSignal());
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
    if (this.isAuthenticated() && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!this.isAuthenticated()) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
