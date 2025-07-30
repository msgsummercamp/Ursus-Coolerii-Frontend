import { Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { LanguageSwitcherService } from '../services/language-switcher.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslocoDirective, MatMenu, MatMenuItem, MatMenuTrigger, MatIconButton, MatIcon],
  providers: [LanguageSwitcherService],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent {
  // DI
  private languageSwitcherService = inject(LanguageSwitcherService);

  protected languages = this.languageSwitcherService.languages();
  protected currentLanguage = this.languageSwitcherService.currentLanguage();

  public selectLanguage(lang: string): void {
    this.languageSwitcherService.setCurrentLanguage(lang);
  }
}
