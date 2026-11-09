import { Component, computed, input, output } from '@angular/core';
import { ProductResponse } from '../../../models/products/product.response';
import { categoryIcon } from '../../../util/categories';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  public readonly product = input.required<ProductResponse>();
  public deleteItem = output<ProductResponse>();
  public editProduct = output<ProductResponse>();
  public category_icon_path = computed(() => {
    return categoryIcon(this.product().category?.name || 'Other');
  });
  iconMask = computed(() => `url(${this.category_icon_path() ?? '/icons/other.svg'})`);

  stockState = computed(() => {
    const stock = this.product().stock;
    return stock === 0 ? 'error' : stock > 5 ? 'success' : 'warning';
  });
}
