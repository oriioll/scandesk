import { Component, input, output, signal } from '@angular/core';
import { ProductResponse } from '../../models/products/product.response';
import { ProductService } from '../../services/product.service';
import { toast } from 'ngx-sonner';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-delete-dialog',
  imports: [],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css',
})
export class DeleteDialogComponent {
  constructor(private productService: ProductService) {}
  public readonly productToDelete = input.required<ProductResponse | null>();
  protected readonly error = signal(false);
  protected readonly loading = signal(false);
  public closeDialogAndLoad = output<boolean>();

  /**
   * Handles the deletion of a product using productService
   */
  public onDeleteProduct() {
    this.error.set(false);
    this.loading.set(true);
    if (this.productToDelete()) {
      this.productService
        .deleteProduct(this.productToDelete()!!.id)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: () => {
            this.closeDialogAndLoad.emit(true);
            toast.success('Product deleted successfully');
          },
          error: () => {
            this.error.set(true);
          },
        });
    }
  }
  /**
   * Emits event to close the dialog and not load again the products
   */
  public onCancel() {
    this.closeDialogAndLoad.emit(false);
  }
}
