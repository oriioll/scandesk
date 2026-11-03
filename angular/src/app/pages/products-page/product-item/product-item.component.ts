import { Component, input, output } from '@angular/core';
import { ProductResponse } from '../../../models/products/product.response';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-item',
  imports: [DecimalPipe],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css',
})
export class ProductItemComponent {
  public readonly product = input.required<ProductResponse>();
  public deleteItem = output<ProductResponse>();
  public editProduct = output<ProductResponse>();
}
