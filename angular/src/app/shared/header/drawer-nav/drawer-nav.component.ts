import { Component, computed, inject, input, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderLogoComponent } from '../header-logo/header-logo.component';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { ThemeMode } from '../../../models/header/theme-mode';
import { SkeletonComponent } from '../../skeleton/skeleton.component';

@Component({
  selector: 'app-drawer-nav',
  imports: [HeaderLogoComponent, RouterLink, RouterLinkActive, SkeletonComponent],
  templateUrl: './drawer-nav.component.html',
  styleUrl: './drawer-nav.component.css',
})
export class DrawerNavComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly themeService = inject(ThemeService);

  readonly username = input('');
  readonly email = input('');
  readonly loading = input(false);
  readonly loadError = input(false);
  readonly closeRequested = output<void>();

  protected readonly userAcronym = computed(() =>
    this.username()
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase(),
  );

  protected readonly themeOptions: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  protected onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.closeRequested.emit();
        this.router.navigate(['/login']);
      },
    });
  }
}
