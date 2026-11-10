import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../icon/icon.component';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';
import { HeaderLogoComponent } from '../header-logo/header-logo.component';

@Component({
  selector: 'app-header-landing',
  imports: [RouterLink, IconComponent, ThemeToggleComponent, HeaderLogoComponent],
  templateUrl: './header-landing.component.html',
  styleUrl: './header-landing.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'menuOpen.set(false)' },
})
export class HeaderLandingComponent {
  private readonly router = inject(Router);

  readonly links = [
    { id: 'how-it-works', label: 'How it works' },
    { id: 'features', label: 'Features' },
    { id: 'security', label: 'Security' },
    { id: 'faq', label: 'FAQ' },
  ];

  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);

  constructor() {
    // `scroll` no hace bubbling, pero sí se puede capturar. Así funciona tanto si
    // scrollea el window como si scrollea <mat-drawer-content> (lo que ocurre en tu app.component).
    const onScroll = (e: Event) => {
      const t = e.target;
      const y =
        t instanceof Document
          ? window.scrollY
          : t instanceof HTMLElement && t.tagName === 'MAT-DRAWER-CONTENT'
            ? t.scrollTop
            : null;
      if (y !== null) this.scrolled.set(y > 8);
    };
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    inject(DestroyRef).onDestroy(() => document.removeEventListener('scroll', onScroll, true));
  }

  LANDING = '/info';
  goTo(e: Event, id: string): void {
    e.preventDefault();
    this.menuOpen.set(false);
    if (this.router.url.split(/[?#]/)[0] === this.LANDING) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      this.router.navigate([this.LANDING], { fragment: id }); // p. ej. desde /terms
    }
  }
}
