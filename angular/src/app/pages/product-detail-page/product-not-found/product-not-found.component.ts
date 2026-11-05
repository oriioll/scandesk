import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-not-found',
  imports: [],
  templateUrl: './product-not-found.component.html',
  styleUrl: './product-not-found.component.css',
})
export class ProductNotFoundComponent {
  constructor(private router: Router) {}
  /**
   * Handles the click of the button to go to the products page
   */
  public onButtonClick() {
    this.router.navigate(['/products']);
  }
}
