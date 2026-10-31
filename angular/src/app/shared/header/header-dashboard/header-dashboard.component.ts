import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderLogoComponent } from '../header-logo/header-logo.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { ThemeService } from '../../../services/theme.service';
import { ThemeMode } from '../../../models/header/theme-mode';

@Component({
  selector: 'app-header-app',
  imports: [
    HeaderLogoComponent,
    RouterLinkActive,
    RouterLink,
    ThemeToggleComponent,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
  ],
  templateUrl: './header-dashboard.component.html',
  styleUrl: './header-dashboard.component.css',
})
export class HeaderDashboardComponent implements OnInit {
  public username = signal('');
  public email = signal('');
  public router = inject(Router);
  constructor(
    private authService: AuthService,
    public themeService: ThemeService,
  ) {}
  ngOnInit(): void {
    this.authService.whoami().subscribe({
      next: (data) => {
        this.username.set(data.name);
        this.email.set(data.email);
      },
    });
  }
  /**
   * Gets the acronym of the current logged uset
   * @returns string of the acronyym
   */
  get userAcronym(): string {
    return this.username()
      .trim()
      .split(/\s+/)
      .map((word: string) => word[0])
      .join('')
      .toUpperCase();
  }

  /**
   * Handles logout
   */
  public onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
    });
  }
  protected readonly themeOptions: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  // el menú se alinea por su borde derecho con el avatar, 8px por debajo
  protected readonly menuPosition: ConnectedPosition[] = [
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 8 },
  ];
}
