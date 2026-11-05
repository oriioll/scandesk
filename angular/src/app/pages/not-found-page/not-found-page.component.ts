import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.css',
})
export class NotFoundPage {
  constructor(
    private router: Router,
    private location: Location,
  ) {}

  /**
   * Navigates to the dashboard
   */
  public goDashboard() {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Navigates to the last url
   */
  goBack(): void {
    this.location.back();
  }
}
