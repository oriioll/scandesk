import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ThemeMode } from '../models/header/theme-mode';

const STORAGE_KEY = 'scandesk-theme'; // misma clave que usaba el toggle

@Injectable({ providedIn: 'root' })
/**
 * Single source of truth for the application theme
 */
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly systemDark = signal(false);

  /** User's choice: light, dark or follow the OS */
  readonly mode = signal<ThemeMode>('system');

  /** Theme actually being displayed (never 'system') */
  readonly resolved = computed<'light' | 'dark'>(() => {
    const mode = this.mode();
    return mode === 'system' ? (this.systemDark() ? 'dark' : 'light') : mode;
  });

  constructor() {
    if (!this.isBrowser) return;

    const win = this.document.defaultView!;
    const query = win.matchMedia('(prefers-color-scheme: dark)');
    this.systemDark.set(query.matches);
    query.addEventListener('change', (e) => this.systemDark.set(e.matches));

    const stored = win.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') this.mode.set(stored);

    effect(() => {
      const mode = this.mode();
      const root = this.document.documentElement;
      if (mode === 'system') {
        delete root.dataset['theme']; // sin atributo, styles.css sigue al sistema
        win.localStorage.removeItem(STORAGE_KEY);
      } else {
        root.dataset['theme'] = mode;
        win.localStorage.setItem(STORAGE_KEY, mode);
      }
    });
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  /** Flips the theme currently displayed */
  toggle(): void {
    this.set(this.resolved() === 'dark' ? 'light' : 'dark');
  }
}
