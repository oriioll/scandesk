import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';
import { HistoryService } from '../../services/history.service';
import { toast } from 'ngx-sonner';
import { StockHistoryResponse } from '../../models/history/stock-history.response';
import { finalize } from 'rxjs';
import { SortKey } from '../../models/history/history.sortKeys';
import { HistoryAction } from '../../models/history/history-action.enum';
import { RouterLink } from '@angular/router';
import { HistoryItemComponent } from './history-item/history-item.component';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-history-products-page',
  imports: [SkeletonComponent, FormsModule, RouterLink, HistoryItemComponent, UpperCasePipe],
  templateUrl: './history-products-page.component.html',
  styleUrl: './history-products-page.component.css',
})
export class HistoryProductsPage implements OnInit {
  public searchContent = signal('');
  public selectedAction = signal<HistoryAction | null>(null);
  public history = signal<StockHistoryResponse[]>([]);
  protected readonly loadingHistory = signal(true);
  protected readonly historyError = signal(false);
  protected readonly historySkeletonRows = [0, 1, 2, 3, 4];
  protected readonly actions = Object.values(HistoryAction);

  constructor(private readonly historyService: HistoryService) {}

  public readonly HISTORY_TO_RENDER = computed(() => {
    const searchedText = this.searchContent().toLowerCase().trim();
    const selectedAction = this.selectedAction();

    return this.history().filter(
      (entry) =>
        entry.product.name.toLowerCase().includes(searchedText) &&
        (!selectedAction || entry.operation === selectedAction),
    );
  });

  protected readonly columns: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Product name' },
    { key: 'field', label: 'Field' },
    { key: 'operation', label: 'Operation' },
    { key: 'new_value', label: 'New value' },
    { key: 'old_value', label: 'Old value' },
    { key: 'created_at', label: 'Date' },
  ];
  protected readonly sortKey = signal<SortKey | null>(null);
  protected readonly sortDir = signal<'asc' | 'desc'>('asc');

  public readonly SORTED_HISTORY = computed(() => {
    const key = this.sortKey();
    const list = this.HISTORY_TO_RENDER();
    if (!key) return list;
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => dir * this.compare(a, b, key));
  });

  /** Same column → flips direction. New column → ascending. */
  protected toggleSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  private compare(a: StockHistoryResponse, b: StockHistoryResponse, key: SortKey): number {
    const valueFor = (entry: StockHistoryResponse): string =>
      key === 'name' ? entry.product.name : (entry[key] ?? '');
    return valueFor(a).localeCompare(valueFor(b), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }

  /**
   * Loads the user's product history when the page is initialized.
   */
  ngOnInit(): void {
    this.loadHistory();
  }

  /**

   */
  protected loadHistory(): void {
    this.loadingHistory.set(true);
    this.historyError.set(false);
    this.historyService
      .getAll()
      .pipe(finalize(() => this.loadingHistory.set(false)))
      .subscribe({
        next: (entries: StockHistoryResponse[]) => this.history.set(entries),
        error: () => {
          this.historyError.set(true);
          toast.error("Couldn't load the history");
        },
      });
  }
}
