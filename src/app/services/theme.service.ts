import { Injectable, signal, computed, effect } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'theme-preference';
  private preferenceSignal = signal<ThemePreference>('system');
  private osDark = signal(false);

  readonly preference = this.preferenceSignal.asReadonly();

  readonly effective = computed(() => {
    const pref = this.preferenceSignal();
    if (pref !== 'system') return pref;
    return this.osDark() ? 'dark' : 'light';
  });

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY) as ThemePreference | null;
    if (saved) this.preferenceSignal.set(saved);

    this.osDark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.osDark.set(e.matches);
    });

    effect(() => {
      const theme = this.effective();
      document.documentElement.classList.toggle('dark', theme === 'dark');
      this.updateMetaThemeColor(theme);
    });
  }

  setPreference(pref: ThemePreference) {
    this.preferenceSignal.set(pref);
    localStorage.setItem(this.STORAGE_KEY, pref);
  }

  cycle(): ThemePreference {
    const order: ThemePreference[] = ['light', 'dark', 'system'];
    const current = this.preferenceSignal();
    const next = order[(order.indexOf(current) + 1) % order.length];
    this.setPreference(next);
    return next;
  }

  private updateMetaThemeColor(theme: 'light' | 'dark') {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#1e1e1e' : '#f5f5f5');
    }
  }
}
