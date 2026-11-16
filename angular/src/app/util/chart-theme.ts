import { DestroyRef, inject, signal } from '@angular/core';
/**
 * Gets the colors of the css variables to use it in charts
 * @returns object with all the app palette for charts
 * @author Oriol Plazas
 * @since 1.0.0
 */
export function chartTheme() {
  const root = getComputedStyle(document.documentElement);
  const probe = document.createElement('span');
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const color = (name: string) => {
    probe.style.color = `var(${name})`;
    return getComputedStyle(probe).color;
  };
  const font = (name: string) => root.getPropertyValue(name).trim();
  const theme = {
    primary: color('--primary'),
    accent: color('--accent'),
    text: color('--text'),
    muted: color('--text-muted'),
    border: color('--border'),
    surface: color('--surface'),
    font: font('--font-body'),
    heading: font('--font-heading'),
  };
  probe.remove();
  return theme;
}

export function themeVersion() {
  const version = signal(0);
  const bump = () => version.update((v) => v + 1);

  const observer = new MutationObserver(bump);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  const mq = matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', bump);

  inject(DestroyRef).onDestroy(() => {
    observer.disconnect();
    mq.removeEventListener('change', bump);
  });
  return version;
}
export function isDarkTheme(): boolean {
  const forced = document.documentElement.dataset['theme'];
  return forced ? forced === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
}

export function categoryPalette(n: number): string[] {
  const lightness = isDarkTheme() ? 68 : 48;
  const startHue = 268;
  return Array.from(
    { length: n },
    (_, i) => `hsl(${Math.round((startHue + i * 137.5) % 360)} 60% ${lightness}%)`,
  );
}
