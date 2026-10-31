import { Component, OnInit, signal } from '@angular/core';
import { HeaderLogoComponent } from '../header-logo/header-logo.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header-app',
  imports: [HeaderLogoComponent, RouterLinkActive, RouterLink, ThemeToggleComponent],
  templateUrl: './header-dashboard.component.html',
  styleUrl: './header-dashboard.component.css',
})
export class HeaderDashboardComponent implements OnInit {
  public username = signal('');
  public email = signal('');
  constructor(private authService: AuthService) {}
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
}
