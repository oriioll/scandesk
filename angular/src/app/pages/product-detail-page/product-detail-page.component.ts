import { Component, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../models/products/product.response';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import JsBarcode from 'jsbarcode';
import { ProductNotFoundComponent } from './product-not-found/product-not-found.component';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { CategoryResponse } from '../../models/categories/category.response';
import { ProductRequest } from '../../models/products/product.request';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { categoryIcon } from '../../util/categories';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NgTemplateOutlet } from '@angular/common';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-product-detail-page',
  imports: [
    RouterLink,
    ProductNotFoundComponent,
    ReactiveFormsModule,
    MatSidenavModule,
    NgTemplateOutlet,
    SkeletonComponent,
    DeleteDialogComponent,
  ],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.css',
})
export class ProductDetailPage implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private route: ActivatedRoute,
    private readonly router: Router,
  ) {
    effect(() => {
      this.renderBarcode();
    });
  }

  // Product state
  protected isLoading = signal(false);
  protected error = signal(false);
  protected product = signal<ProductResponse | null>(null);
  protected readonly id = signal(0);

  // Categories state
  protected categories = signal<CategoryResponse[]>([]);
  protected categoriesLoading = signal(false);

  // Form state
  protected submitting = signal(false);
  protected formError = signal('');
  protected readonly deleteOpen = signal(false);

  // Html items
  public barcodeSvg = viewChild<ElementRef<SVGElement>>('barcodeSvg');
  readonly editDrawer = viewChild<MatDrawer>('editDrawer');

  protected readonly categoryIcon = categoryIcon;

  public editForm = this.fb.group({
    barcode: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]{8,14}$')]],
    name: ['', [Validators.required]],
    category_id: this.fb.control<number | null>(null, Validators.required),
    price: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    stock: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
  });

  ngOnInit(): void {
    const urlId = this.route.snapshot.paramMap.get('id');
    const id = urlId ? Number.parseInt(urlId, 10) : Number.NaN;
    if (Number.isNaN(id) || id <= 0) {
      this.error.set(true);
      return;
    }
    this.id.set(id);
    this.loadProductData(this.id());
    this.loadCategories();
  }

  /**
   * Loads the product and patches the form with current values
   * @param id the id of the product to load
   */
  protected loadProductData(id: number): void {
    this.isLoading.set(true);
    this.productService
      .getProductById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (p: ProductResponse) => {
          this.product.set(p);
          this.patchForm(p);
        },
        error: () => {
          this.error.set(true);
        },
      });
  }

  /**
   * Patches the edit form with product data
   */
  private patchForm(p: ProductResponse): void {
    this.editForm.patchValue({
      barcode: p.barcode,
      name: p.name,
      category_id: p.category?.id ?? null,
      price: p.price,
      stock: p.stock,
    });
  }

  /**
   * Resets the form to current product values (Cancel)
   */
  protected onCancel(): void {
    const p = this.product();
    if (p) this.patchForm(p);
  }

  /**
   * Closes the delete confirmation and returns to the product list after deletion.
   * @param deleted Whether the product was successfully deleted.
   */
  protected onDeleteClose(deleted: boolean): void {
    this.deleteOpen.set(false);
    if (deleted) {
      this.router.navigate(['/products']);
    }
  }

  /**
   * Saves the updated product via PUT
   */
  protected onSave(): void {
    const { category_id, price, stock, ...rest } = this.editForm.getRawValue();
    if (this.editForm.invalid || category_id === null || price === null || stock === null) {
      this.editForm.markAllAsTouched();
      return;
    }
    if (this.submitting()) return;

    this.formError.set('');
    this.submitting.set(true);

    const payload: ProductRequest = { ...rest, category_id, price, stock };

    this.productService
      .putProduct(this.id(), payload)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          toast.success('Changes saved');
          this.loadProductData(this.id());
        },
        error: (err: HttpErrorResponse) => {
          this.handleSaveError(err);
        },
      });
  }

  /**
   * Handles PUT error and sets formError signal
   */
  private handleSaveError(err: HttpErrorResponse): void {
    if (err.status === 0) {
      this.formError.set('No connection. Check your network and try again.');
    } else if (err.status === 409) {
      this.formError.set('A product with this barcode already exists.');
    } else if (err.status === 422) {
      const msgs: string[] = [];
      for (const fieldMsgs of Object.values<string[]>(err.error?.errors ?? {})) {
        msgs.push(...fieldMsgs);
      }
      this.formError.set(msgs.join(' '));
    } else {
      this.formError.set("Couldn't save the product, please try again later.");
    }
  }

  /**
   * Returns field-level error message for a given control name
   */
  protected fieldError(name: 'barcode' | 'name' | 'category_id' | 'price' | 'stock'): string {
    const c = this.editForm.controls[name];
    if (!c.touched || !c.errors) return '';
    if (c.errors['server']) return c.errors['server'];
    if (c.errors['required']) return 'Required';
    if (c.errors['min']) return 'Must be 0 or greater';
    if (c.errors['pattern']) return 'Enter a valid barcode';
    return 'Invalid value';
  }

  /**
   * Loads categories for the select dropdown
   */
  private loadCategories(): void {
    this.categoriesLoading.set(true);
    this.categoryService
      .getAll()
      .pipe(finalize(() => this.categoriesLoading.set(false)))
      .subscribe({
        next: (cats) => this.categories.set(cats),
        error: () => toast.error("Couldn't load categories"),
      });
  }

  /**
   * Renders the barcode using jsBarcode library
   */
  private renderBarcode(): void {
    const svg = this.barcodeSvg()?.nativeElement;
    const barcode = this.product()?.barcode;
    if (svg && barcode) {
      JsBarcode(svg, barcode, {
        format: this.detectBarcodeFormat(barcode),
        width: 3,
        height: 100,
        background: 'transparent',
        lineColor: getComputedStyle(document.documentElement).getPropertyValue('--text').trim(),
        font: 'Figtree',
        fontSize: 14,
        textMargin: 8,
        marginBottom: 10,
        marginTop: 10,
        displayValue: true,
      });
    }
  }

  /**
   * Detects the format of the barcode
   * @param value The barcode to detect its format
   * @returns The format of the barcode
   */
  private detectBarcodeFormat(value: string): string {
    const isNumeric = /^\d+$/.test(value);
    if (isNumeric) {
      if (value.length === 13) return 'EAN13';
      if (value.length === 8) return 'EAN8';
      if (value.length === 12) return 'UPC';
    }
    return 'CODE128';
  }
}
