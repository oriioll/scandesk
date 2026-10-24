import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly theme = signal<Theme>('light');

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    const root = this.document.documentElement;
    const savedTheme = this.document.defaultView?.localStorage.getItem('scandesk-theme');
    const systemTheme: Theme = this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const initialTheme: Theme =
      savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : systemTheme;

    this.theme.set(initialTheme);
    root.dataset['theme'] = initialTheme;
  }

  /** Switches the active theme and persists the user's choice. */
  protected toggleTheme(): void {
    const nextTheme: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);
    this.document.documentElement.dataset['theme'] = nextTheme;
    this.document.defaultView?.localStorage.setItem('scandesk-theme', nextTheme);
  }
}
