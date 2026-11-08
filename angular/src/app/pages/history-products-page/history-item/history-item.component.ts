import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { StockHistoryResponse } from '../../../models/history/stock-history.response';
import { HistoryAction } from '../../../models/history/history-action.enum';
const EUR = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

interface ChangeView {
  kind: 'create' | 'edit' | 'delete';
  old: string;
  text: string; // valor "principal": el nuevo (o el borrado en delete)
  delta: { label: string; up: boolean } | null;
}
@Component({
  selector: 'app-history-item',
  imports: [DatePipe],
  templateUrl: './history-item.component.html',
  styleUrl: './history-item.component.css',
})
export class HistoryItemComponent {
  public readonly history = input.required<StockHistoryResponse>();
  //Protects the product name if the product appears as null or deleted
  protected readonly productName = computed(
    () => this.history().product?.name ?? this.history().old_value ?? 'Deleted product',
  );
  protected readonly fieldLabel = computed(() => {
    const field = this.history().field;
    if (field === 'all') return '—';
    const text = field.replaceAll('_', ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
  });

  protected readonly change = computed<ChangeView>(() => {
    const h = this.history();
    const fmt = (v: string | null): string => {
      if (v === null || v === '') return '—';
      if (h.field !== 'price') return v;
      const n = Number(v);
      return Number.isNaN(n) ? v : EUR.format(n);
    };

    if (h.operation === HistoryAction.Create) {
      return { kind: 'create', old: '', text: fmt(h.new_value), delta: null };
    }
    if (h.operation === HistoryAction.Delete) {
      return { kind: 'delete', old: '', text: fmt(h.old_value), delta: null };
    }

    let delta: ChangeView['delta'] = null;
    if (h.field === 'stock' && h.old_value !== null && h.new_value !== null) {
      const diff = Number(h.new_value) - Number(h.old_value);
      if (Number.isFinite(diff) && diff !== 0) {
        delta = { label: `${diff > 0 ? '+' : '−'}${Math.abs(diff)}`, up: diff > 0 };
      }
    }
    return { kind: 'edit', old: fmt(h.old_value), text: fmt(h.new_value), delta };
  });
}
