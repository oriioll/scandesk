import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';
import { OrderService } from '../../services/order.service';
import { toast } from 'ngx-sonner';
import { OrderResponse } from '../../models/orders/order.response';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { HistoryOrdersItemComponent } from './history-order-item/history-orders-item.component';

type OrderSortKey = 'id' | 'total_price' | 'different_items' | 'total_articles';

@Component({
  selector: 'app-history-orders-page',
  imports: [SkeletonComponent, FormsModule, RouterLink, HistoryOrdersItemComponent],
  templateUrl: './history-orders-page.component.html',
  styleUrl: './history-orders-page.component.css',
})
export class HistoryOrdersPage implements OnInit {
  public searchContent = signal('');
  public orders = signal<OrderResponse[]>([]);
  protected readonly loadingOrders = signal(true);
  protected readonly ordersError = signal(false);
  protected readonly orderSkeletonRows = [0, 1, 2, 3, 4];

  constructor(private readonly orderService: OrderService) {}

  public readonly ORDERS_TO_RENDER = computed(() => {
    const searchedText = this.searchContent().toLowerCase().trim();
    return this.orders().filter((order) =>
      String(order.id).includes(searchedText),
    );
  });

  protected readonly columns: { key: OrderSortKey; label: string; sortable: boolean; cls?: string }[] = [
    { key: 'id', label: 'Order ID', sortable: true, cls: 'col-order' },
    { key: 'total_price', label: 'Total price', sortable: true, cls: 'col-total' },
    { key: 'different_items', label: 'Different items', sortable: true, cls: 'col-different-items' },
    { key: 'total_articles', label: 'Total articles', sortable: true, cls: 'col-articles' },
  ];
  protected readonly sortKey = signal<OrderSortKey | null>('id');
  protected readonly sortDir = signal<'asc' | 'desc'>('desc');

  public readonly SORTED_ORDERS = computed(() => {
    const key = this.sortKey();
    const list = this.ORDERS_TO_RENDER();
    if (!key) return list;
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => dir * this.compareOrders(a, b, key));
  });

  /**
   * Toggle the sort direction or select a new column.
   * @param key Column used to sort the orders.
   * @return void
   * @author Oriol Plazas
   * @since 1.0.0
   */
  protected toggleSort(key: OrderSortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  /**
   * Compare orders by the selected numeric field.
   * @param a First order to compare.
   * @param b Second order to compare.
   * @param key Field used for comparison.
   * @return Numeric sort difference.
   * @author Oriol Plazas
   * @since 1.0.0
   */
  private compareOrders(a: OrderResponse, b: OrderResponse, key: OrderSortKey): number {
    const valueFor = (order: OrderResponse): number => {
      switch (key) {
        case 'id':
          return order.id;
        case 'total_price':
          return Number(order.total_price);
        case 'different_items':
          return new Set(order.items?.map((item) => item.product_id) ?? []).size;
        case 'total_articles':
          return (order.items ?? []).reduce((total, item) => total + item.quantity, 0);
      }
    };

    return valueFor(a) - valueFor(b);
  }

  /**
   * Load the user's order history when the page is initialized.
   * @return void
   * @author Oriol Plazas
   * @since 1.0.0
   */
  ngOnInit(): void {
    this.loadOrders();
  }

  /**
   * Fetch the user's orders and update the page state.
   * @return void
   * @author Oriol Plazas
   * @since 1.0.0
   */
  protected loadOrders(): void {
    this.loadingOrders.set(true);
    this.ordersError.set(false);
    this.orderService
      .getOrders()
      .pipe(finalize(() => this.loadingOrders.set(false)))
      .subscribe({
        next: (orders: OrderResponse[]) => this.orders.set(orders),
        error: () => {
          this.ordersError.set(true);
          toast.error("Couldn't load the orders");
        },
      });
  }
}
