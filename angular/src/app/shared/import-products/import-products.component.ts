import { Component, signal } from '@angular/core';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-import-products',
  imports: [],
  templateUrl: './import-products.component.html',
  styleUrl: './import-products.component.css',
})
export class ImportProductsComponent {
  protected readonly importing = signal(false);
  protected onCsvSelected(event: Event) {
    this.importing.set(true);
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || file.size > 1_000_000) toast.error('CSV too large (max 1 MB)');
    this.importing.set(false);
  }
}
