import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';
import { HeaderLogoComponent } from '../header-logo/header-logo.component';

@Component({
  selector: 'app-header-auth',
  imports: [ThemeToggleComponent, HeaderLogoComponent],
  templateUrl: './header-auth.component.html',
  styleUrl: './header-auth.component.css',
})
export class HeaderAuthComponent {}
