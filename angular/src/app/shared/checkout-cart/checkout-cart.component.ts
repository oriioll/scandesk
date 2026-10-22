import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartItem } from '../../model/CartItem';

@Component({
  selector: 'app-checkout-cart',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkout-cart.component.html',
  styleUrl: './checkout-cart.component.css',
})
export class CheckoutCartComponent {
  public items = input.required<CartItem[]>();
  public submitting = input(false);
  public checkout = output<void>();
  public remove = output<number>();
  public count = computed(() => this.items().reduce((n, i) => n + i.quantity, 0));
  // Sum in cents to avoid float drift (0.1 + 0.2). Display only: the backend recalculates.
  public total = computed(
    () => this.items().reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0) / 100,
  );

  // Check if can checkout - Only if the price is > (empty cart) and no submitting already
  public canCheckout = computed(() => this.total() > 0 && !this.submitting());
}
