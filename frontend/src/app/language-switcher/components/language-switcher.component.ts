import {Component, inject} from '@angular/core';
import {TranslocoDirective} from "@jsverse/transloco";
import {MatFormField} from "@angular/material/input";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {LanguageSwitcherService} from "../services/language-switcher.service";

@Component({
    selector: 'app-language-switcher',
    imports: [
        MatFormField,
        MatSelect,
        MatOption,
        TranslocoDirective,
    ],
    providers: [LanguageSwitcherService],
    templateUrl: './language-switcher.component.html',
    styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent {
    // DI
    private languageSwitcherService = inject(LanguageSwitcherService);

    protected languages = this.languageSwitcherService.languages();
    protected currentLanguage = this.languageSwitcherService.currentLanguage();

    public onChange(event: MatSelectChange): void {
        this.languageSwitcherService.setCurrentLanguage(event.value);
    }
}
