import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-logo',
  imports: [],
  templateUrl: './header-logo.component.html',
  styleUrl: './header-logo.component.css',
})
export class HeaderLogoComponent {
  private router = inject(Router);
  /**
   * Handles click event on logo
   */
  public onLogoClick() {
    this.router.navigate(['/dashboard']);
  }
}
