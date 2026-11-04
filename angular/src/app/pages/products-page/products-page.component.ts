import { Component, computed, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { toast } from 'ngx-sonner';
import { CategoryResponse } from '../../models/categories/category.response';
import { ProductRequest } from '../../models/products/product.request';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { ProductFormComponent } from '../../shared/product-form/product-form.component';
import { ProductResponse } from '../../models/products/product.response';
import { categoryIcon } from '../../util/categories';
import { FormsModule } from '@angular/forms';
import { ProductItemComponent } from './product-item/product-item.component';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';
import { SortKey } from '../../models/products/product.sortKeys';
import { ImportProductsComponent } from '../../shared/import-products/import-products.component';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-page',
  imports: [
    ProductFormComponent,
    FormsModule,
    ProductItemComponent,
    DeleteDialogComponent,
    ImportProductsComponent,
    SkeletonComponent,
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
})
export class ProductsPage implements OnInit {
  @ViewChild('createProductDialog')
  private createProductDialog!: ElementRef<HTMLDialogElement>;
  protected readonly categories = signal<CategoryResponse[]>([]);
  protected readonly loadingCategories = signal(true);
  protected readonly submitting = signal(false);
  protected readonly formError = signal('');
  protected readonly fieldErrors = signal<Record<string, string>>({});
  protected readonly dialogOpen = signal(false);
  protected readonly deleteOpen = signal(false);
  public productToDelete = signal<ProductResponse | null>(null);
  protected readonly categoryIcon = categoryIcon;
  public searchContent = signal('');
  public selectedCategoryId = signal<number | null>(null);
  public products = signal<ProductResponse[]>([]);
  protected readonly loadingProducts = signal(true);
  protected readonly productsError = signal(false);
  protected readonly productSkeletonRows = [0, 1, 2, 3, 4];
  public readonly formOperation = signal<'insert' | 'update'>('insert');
  public productToEdit = signal<ProductResponse | null>(null);

  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    private readonly router: Router,
  ) {}

  /**
   * Filters the content to render based on filters or searching applied
   */
  public PRODUCTS_TO_RENDER = computed(() => {
    //Collect possible searched text
    const searchedText = this.searchContent().toLowerCase().trim();
    //Check if filters are active
    if ((!searchedText || searchedText.length <= 0) && !this.selectedCategoryId()) {
      return this.products();
    }
    //Return the products applying all the filters
    return this.products().filter(
      (p: ProductResponse) =>
        (p.name.toLowerCase().includes(searchedText) ||
          p.barcode.toLowerCase().includes(searchedText)) &&
        (!this.selectedCategoryId() || p.category?.id === this.selectedCategoryId()),
    );
  });
  protected readonly columns: { key: SortKey; label: string }[] = [
    { key: 'barcode', label: 'Barcode' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
  ];
  protected readonly sortKey = signal<SortKey | null>(null);
  protected readonly sortDir = signal<'asc' | 'desc'>('asc');

  /** Applies the sort on top of the already filtered products */
  public SORTED_PRODUCTS = computed(() => {
    const key = this.sortKey();
    const list = this.PRODUCTS_TO_RENDER();
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

  private compare(a: ProductResponse, b: ProductResponse, key: SortKey): number {
    switch (key) {
      case 'price':
        return Number(a.price) - Number(b.price); // Laravel puede devolver el DECIMAL como string
      case 'stock':
        return a.stock - b.stock;
      case 'category':
        return (a.category?.name ?? 'Uncategorized').localeCompare(
          b.category?.name ?? 'Uncategorized',
        );
      default: // barcode | name
        return a[key].localeCompare(b[key], undefined, { numeric: true });
    }
  }

  /**
   * Loads the categories needed by the product form.
   */
  ngOnInit(): void {
    //Load the products
    this.loadProducts();
    this.categoryService
      .getAll()
      .pipe(finalize(() => this.loadingCategories.set(false)))
      .subscribe({
        next: (categories) => this.categories.set(categories),
        error: () => toast.error("Couldn't load categories"),
      });
  }

  /**
   * Fetches the api to load all the user products
   */
  protected loadProducts() {
    //Load the products
    this.loadingProducts.set(true);
    this.productsError.set(false);
    this.productService
      .getMyProducts()
      .pipe(finalize(() => this.loadingProducts.set(false)))
      .subscribe({
        next: (products: ProductResponse[]) => this.products.set(products),
        error: () => {
          this.productsError.set(true);
          toast.error("Couldn't load products");
        },
      });
  }
  /**
   * Opens the create-product dialog with a newly initialized empty form.
   */
  protected openCreateProductDialog(): void {
    this.formOperation.set('insert');
    this.formError.set('');
    this.fieldErrors.set({});
    this.dialogOpen.set(true);
    if (!this.createProductDialog.nativeElement.open) {
      this.createProductDialog.nativeElement.showModal();
    }
  }

  /**
   * Opens the dialog to edit a product in edit mode.
   */
  protected openEditProductDialog(p: ProductResponse): void {
    console.log('RECEIVED OUTPUT');
    this.formOperation.set('update');
    this.productToEdit.set(p);
    this.formError.set('');
    this.fieldErrors.set({});
    this.dialogOpen.set(true);
    if (!this.createProductDialog.nativeElement.open) {
      this.createProductDialog.nativeElement.showModal();
    }
  }

  /**
   * Opens the dialog to delete a product
   */
  protected openDeleteProductDialog(p: ProductResponse): void {
    this.productToDelete.set(p);
    this.deleteOpen.set(true);
  }

  /**
   * Closes the dialog of delete products
   * @param load Decide if load again produts or not
   */
  public onDeleteClose(load: boolean): void {
    this.deleteOpen.set(false);
    if (load) {
      this.loadProducts();
    }
  }

  /**
   * Closes the create-product dialog when its backdrop is clicked.
   * @param event Click event from the dialog surface.
   */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.createProductDialog.nativeElement) {
      this.closeCreateProductDialog();
    }
  }

  /**
   * Closes the create-product dialog.
   */
  protected closeCreateProductDialog(): void {
    if (this.createProductDialog.nativeElement.open) {
      this.createProductDialog.nativeElement.close();
    }
  }

  /**
   * Clears dialog state after it has closed.
   */
  protected onDialogClosed(): void {
    this.dialogOpen.set(false);
  }

  /**
   * Creates a product from the values entered in the dialog.
   * @param value Validated product details.
   */
  protected onProductFormSubmit(value: ProductRequest): void {
    if (this.submitting()) return;
    this.formError.set('');
    this.fieldErrors.set({});
    this.submitting.set(true);
    if (this.formOperation() === 'insert') {
      //If dialog is making insert
      this.productService
        .postProduct(value)
        .pipe(finalize(() => this.submitting.set(false)))
        .subscribe({
          next: () => {
            toast.success('Product created');
            this.loadProducts();
            this.closeCreateProductDialog();
          },
          error: (error: HttpErrorResponse) => this.handleSubmitError(error),
        });
    } else {
      //If dialog is making update
      this.productService
        .putProduct(this.productToEdit()!.id, value)
        .pipe(finalize(() => this.submitting.set(false)))
        .subscribe({
          next: () => {
            toast.success('Product updated');
            this.loadProducts();
            this.closeCreateProductDialog();
          },
          error: (error: HttpErrorResponse) => this.handleSubmitError(error),
        });
    }
  }

  /**
   * Maps product creation errors to form feedback.
   * @param error Error returned by the product API.
   */
  private handleSubmitError(error: HttpErrorResponse): void {
    if (error.status === 0) {
      this.formError.set('No connection. Check your network and try again.');
      return;
    }
    if (error.status === 409) {
      this.formError.set('A product with this barcode already exists.');
      return;
    }
    if (error.status === 422) {
      const visibleFields = ['barcode', 'name', 'category_id', 'price', 'stock'];
      const errors = error.error?.errors as Record<string, unknown> | undefined;
      const fieldErrors: Record<string, string> = {};
      const generalErrors: string[] = [];

      for (const [field, messages] of Object.entries(errors ?? {})) {
        const message = Array.isArray(messages) ? messages[0] : undefined;
        if (typeof message !== 'string') continue;
        if (visibleFields.includes(field)) fieldErrors[field] = message;
        else generalErrors.push(message);
      }

      this.fieldErrors.set(fieldErrors);
      if (generalErrors.length) this.formError.set(generalErrors.join(' '));
      return;
    }
    this.formError.set("Couldn't create the product, please try again later.");
  }

  /**
   * Handles the product click by going to its detail page
   */
  public onProductClick(product: ProductResponse) {
    this.router.navigate(['/products/' + product.id]);
  }
}
