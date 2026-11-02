import { Component, input } from '@angular/core';
import { ProductResponse } from '../../../models/products/product.response';

@Component({
  selector: 'app-product-item',
  imports: [],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css',
})
export class ProductItemComponent {
  public readonly product = input.required<ProductResponse>();
}
