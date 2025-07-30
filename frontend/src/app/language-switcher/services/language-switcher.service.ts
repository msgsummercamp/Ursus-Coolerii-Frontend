import {computed, inject, Injectable, signal, Signal} from '@angular/core';
import {TranslocoService} from "@jsverse/transloco";
import {switchMap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

type LanguagesState = {
    languages: string[];
    currentLanguage: string;
}

@Injectable()
export class LanguageSwitcherService {
    languages: Signal<string[]>;
    currentLanguage: Signal<string>;

    private translocoService = inject(TranslocoService);

    private initialState: LanguagesState = {
        languages: [],
        currentLanguage: ''
    }
    private state = signal(this.initialState);

    constructor() {
        this.languages = computed(() => this.state().languages);
        this.currentLanguage = computed(() => this.state().currentLanguage);

        this.translocoService.langChanges$.pipe(
            switchMap((lang) => this.translocoService.selectTranslation(lang),
            ), takeUntilDestroyed()).subscribe()

        this.setLanguages(this.translocoService.getAvailableLangs() as string[]);
        this.setCurrentLanguage(this.translocoService.getActiveLang());
    }

    public setLanguages(languages: string[]): void {
        this.state.update(state => ({
            ...state,
            languages: languages
        }));
    }

    public setCurrentLanguage(language: string): void {
        this.state.update(state => ({
            ...state,
            currentLanguage: language
        }));
        this.translocoService.setActiveLang(this.state().currentLanguage);
    }


}
