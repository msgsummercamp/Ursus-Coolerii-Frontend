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

    private _translocoService = inject(TranslocoService);

    private _initialState: LanguagesState = {
        languages: [],
        currentLanguage: ''
    }
    private _state = signal(this._initialState);


    setLanguages(languages: string[]): void {
        this._state.update(state => ({
            ...state,
            languages: languages
        }));
    }

    setCurrentLanguage(language: string): void {
        this._state.update(state => ({
            ...state,
            currentLanguage: language
        }));
        this._translocoService.setActiveLang(this._state().currentLanguage);
    }

    constructor() {
        this.languages = computed(() => this._state().languages);
        this.currentLanguage = computed(() => this._state().currentLanguage);

        this._translocoService.langChanges$.pipe(
            switchMap((lang) => this._translocoService.selectTranslation(lang),
            ), takeUntilDestroyed()).subscribe()

        this.setLanguages(this._translocoService.getAvailableLangs() as string[]);
        this.setCurrentLanguage(this._translocoService.getActiveLang());
    }
}
