import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';
import { HeaderLogoComponent } from '../header-logo/header-logo.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-auth',
  imports: [ThemeToggleComponent, HeaderLogoComponent, RouterLink],
  templateUrl: './header-auth.component.html',
  styleUrl: './header-auth.component.css',
})
export class HeaderAuthComponent {}
