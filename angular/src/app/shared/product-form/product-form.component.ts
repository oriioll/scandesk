import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductResponse } from '../../models/products/product.response';
import { ProductRequest } from '../../models/products/product.request';
import { CategoryResponse } from '../../models/categories/category.response';
import { CATEGORY_ICONS, categoryIcon } from '../../util/categories';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent {
  barcode = input.required<string>();
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
  protected readonly categoryIcon = categoryIcon;
  private fb = inject(NonNullableFormBuilder);

  public form = this.fb.group({
    barcode: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]{8,14}$')]],
    name: ['', [Validators.required]],
    category_id: this.fb.control<number | null>(null, Validators.required),
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    effect(() => this.form.controls.barcode.setValue(this.barcode()));
    effect(() => {
      const p = this.product();
      if (p) {
        this.form.patchValue({
          barcode: p.barcode,
          name: p.name,
          category_id: p.category.id,
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
  public onSubmit() {
    const { category_id, ...rest } = this.form.getRawValue();
    if (this.form.invalid || category_id === null) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit({ ...rest, category_id });
  }

  /**
   * Handles errors in the form
   */
  public fieldError(name: 'name' | 'category_id' | 'price' | 'stock'): string {
    const c = this.form.controls[name];
    if (!c.touched || !c.errors) return '';
    if (c.errors['server']) return c.errors['server'];
    if (c.errors['required']) return 'Required';
    if (c.errors['min']) return 'Must be 0 or greater';
    return 'Invalid value';
  }
}
