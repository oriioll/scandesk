import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductResponse } from '../../models/products/product.response';
import { ProductRequest } from '../../models/products/product.request';
import { CategoryResponse } from '../../models/categories/category.response';
import { CATEGORY_ICONS, categoryIcon } from '../../util/categories';
import { SkeletonComponent } from '../skeleton/skeleton.component';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, SkeletonComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent {
  barcode = input.required<string>();
  readonlyBarcode = input(true);
  emptyFields = input(false);
  operation = input<'insert' | 'update'>('insert');
  product = input<ProductResponse | null>(null);
  loading = input(false);
  submitting = input(false);
  lookupFailed = input(false);
  formError = input('');
  fieldErrors = input<Record<string, string>>({});
  submitted = output<ProductRequest>();
  retry = output<void>();
  categories = input<CategoryResponse[]>([]);
  categoriesLoading = input(false);
  protected readonly categoryIcon = categoryIcon;
  private fb = inject(NonNullableFormBuilder);

  public form = this.fb.group({
    barcode: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]{8,14}$')]],
    name: ['', [Validators.required]],
    category_id: this.fb.control<number | null>(null, Validators.required),
    price: this.fb.control<number | null>(0, [Validators.required, Validators.min(0)]),
    stock: this.fb.control<number | null>(0, [Validators.required, Validators.min(0)]),
  });

  constructor() {
    effect(() => this.form.controls.barcode.setValue(this.barcode()));
    effect(() => {
      if (this.emptyFields()) {
        this.form.controls.price.setValue(null);
        this.form.controls.stock.setValue(null);
      }
    });
    effect(() => {
      const p = this.product();
      if (p) {
        this.form.patchValue({
          barcode: p.barcode,
          name: p.name,
          category_id: p.category?.id ?? null,
          price: p.price,
          stock: p.stock,
        });
      }
    });
    effect(() => {
      if (this.loading() || this.lookupFailed()) this.form.disable();
      else this.form.enable();
    });
    effect(() => {
      for (const [field, msg] of Object.entries(this.fieldErrors())) {
        const control = this.form.get(field);
        control?.setErrors({ server: msg });
        control?.markAsTouched();
      }
    });
  }

  /**
   * Function called when form is submitted
   */
  public onSubmit(): void {
    const { category_id, price, stock, ...rest } = this.form.getRawValue();
    if (this.form.invalid || category_id === null || price === null || stock === null) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit({ ...rest, category_id, price, stock });
  }

  /**
   * Handles errors in the form
   */
  public fieldError(name: 'barcode' | 'name' | 'category_id' | 'price' | 'stock'): string {
    const c = this.form.controls[name];
    if (!c.touched || !c.errors) return '';
    if (c.errors['server']) return c.errors['server'];
    if (c.errors['required']) return 'Required';
    if (c.errors['min']) return 'Must be 0 or greater';
    if (c.errors['pattern']) return 'Enter a valid barcode';
    return 'Invalid value';
  }
}
