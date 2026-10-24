import { Component, inject, input } from '@angular/core';
import { KpiTone } from '../../../model/KpiTone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kpi',
  imports: [],
  templateUrl: './kpi.component.html',
  styleUrl: './kpi.component.css',
})
export class Kpi {
  public topText = input<string>();
  public bottomText = input<string>();
  public value = input<string>();
  public tone = input<KpiTone>('default');
  private router = inject(Router);
  public onKpiClick() {
    if (this.topText()?.includes('products') || this.topText()?.includes('stock')) {
      this.router.navigate(['/products']);
    } else if (this.topText()?.includes('sales')) {
      this.router.navigate(['/history/orders']);
    }
  }
}
