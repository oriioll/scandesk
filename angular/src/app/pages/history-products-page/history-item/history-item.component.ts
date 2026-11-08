import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { StockHistoryResponse } from '../../../models/history/stock-history.response';

@Component({
  selector: 'app-history-item',
  imports: [DatePipe],
  templateUrl: './history-item.component.html',
  styleUrl: './history-item.component.css',
})
export class HistoryItemComponent {
  public readonly history = input.required<StockHistoryResponse>();
  protected readonly productName = computed(
    () => this.history().product?.name ?? this.history().old_value ?? 'Deleted product',
  );
}
