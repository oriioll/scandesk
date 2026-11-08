import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-history-page',
  imports: [RouterLink],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.css',
})
export class HistoryPage {
  protected readonly sections = [
    {
      title: 'Product history',
      text: "Every product you've created, edited or deleted.",
      cta: 'View product history',
      route: '/history/products',
      icon: 'i-products',
    },
    {
      title: 'Order history',
      text: "Every sale you've confirmed, with totals and items.",
      cta: 'View order history',
      route: '/history/orders',
      icon: 'i-cart',
    },
  ];
}
