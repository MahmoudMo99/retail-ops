import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'en' | 'ar';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  private readonly storageKey = 'retailops-language';

  readonly currentLanguage = signal<AppLanguage>(this.getInitialLanguage());

  readonly isRtl = computed(() => this.currentLanguage() === 'ar');

  constructor() {
    effect(() => {
      const language = this.currentLanguage();

      this.translate.use(language);

      this.document.documentElement.lang = language;
      this.document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

      localStorage.setItem(this.storageKey, language);
    });
  }

  toggleLanguage(): void {
    this.currentLanguage.update((language) => (language === 'en' ? 'ar' : 'en'));
  }

  setLanguage(language: AppLanguage): void {
    this.currentLanguage.set(language);
  }

  private getInitialLanguage(): AppLanguage {
    const savedLanguage = localStorage.getItem(this.storageKey);

    return savedLanguage === 'ar' ? 'ar' : 'en';
  }
}
