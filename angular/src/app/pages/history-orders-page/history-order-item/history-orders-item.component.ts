import { Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { OrderResponse } from '../../../models/orders/order.response';

@Component({
  selector: 'app-history-order-item',
  imports: [CurrencyPipe],
  templateUrl: './history-orders-item.component.html',
  styleUrl: './history-orders-item.component.css',
})
export class HistoryOrdersItemComponent {
  public readonly order = input.required<OrderResponse>();
  protected readonly differentItems = computed(
    () => new Set(this.order().items?.map((item) => item.product_id) ?? []).size,
  );
  protected readonly totalArticles = computed(
    () => (this.order().items ?? []).reduce((total, item) => total + item.quantity, 0),
  );
}
