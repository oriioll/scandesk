import { Component, output, signal } from '@angular/core';
import { toast } from 'ngx-sonner';
import { ProductRequest } from '../../models/products/product.request';
import Papa from 'papaparse';
import { ProductService } from '../../services/product.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-import-products',
  imports: [],
  templateUrl: './import-products.component.html',
  styleUrl: './import-products.component.css',
})
export class ImportProductsComponent {
  constructor(private productService: ProductService) {}
  protected readonly importing = signal(false);
  private readonly REQUIRED_HEADERS = ['barcode', 'name', 'price', 'stock'];
  public reload = output();

  protected async onCsvSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) return;
    if (file.size > 1_000_000) {
      toast.error('CSV too large (max 1 MB)');
      return;
    }

    this.importing.set(true);
    try {
      const { valid, invalid } = await this.parseProducts(file);

      if (invalid.length) {
        toast.error(
          `${invalid.length} invalid rows (first: row ${invalid[0].row}, ${invalid[0].reason})`,
        );
        return;
      }

      let created = 0;
      const failed: { barcode: string; reason: string }[] = [];

      for (const p of valid) {
        try {
          await firstValueFrom(this.productService.postProduct(p));
          created++;
        } catch (e) {
          failed.push({
            barcode: p.barcode,
            reason:
              e instanceof HttpErrorResponse && e.status === 409
                ? 'duplicate barcode'
                : 'request failed',
          });
        }
      }
      if (created) toast.success(`${created} products imported`);
      if (failed.length) {
        toast.error(`${failed.length} failed (first: ${failed[0].barcode}, ${failed[0].reason})`);
      }
    } catch {
      toast.error('Could not read the CSV');
    } finally {
      this.importing.set(false);
      this.reload.emit();
    }
  }

  private parseProducts(file: File) {
    return new Promise<{ valid: ProductRequest[]; invalid: { row: number; reason: string }[] }>(
      (resolve, reject) => {
        Papa.parse<Record<string, string>>(file, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (h) => h.trim().toLowerCase(),
          error: reject,
          complete: ({ data, errors, meta }) => {
            const missing = this.REQUIRED_HEADERS.filter((h) => !meta.fields?.includes(h));
            if (missing.length) {
              return resolve({
                valid: [],
                invalid: [{ row: 1, reason: `missing columns: ${missing.join(', ')}` }],
              });
            }

            const valid: ProductRequest[] = [];
            const invalid = errors.map((e) => ({ row: (e.row ?? 0) + 2, reason: e.message }));

            data.forEach((row, i) => {
              const p = this.toProduct(row);
              const reason = this.validate(p);
              if (reason) invalid.push({ row: i + 2, reason });
              else valid.push(p);
            });

            resolve({ valid, invalid });
          },
        });
      },
    );
  }

  private toProduct(row: Record<string, string>): ProductRequest {
    return {
      barcode: (row['barcode'] ?? '').trim(),
      name: (row['name'] ?? '').trim(),
      price: Number((row['price'] ?? '').replace(',', '.')),
      stock: parseInt(row['stock'] ?? '', 10),
      category_id: row['category_id']?.trim() ? parseInt(row['category_id'], 10) : 1,
    };
  }

  private validate(p: ProductRequest): string | null {
    if (!p.barcode || p.barcode.length > 64) return 'invalid barcode';
    if (!p.name) return 'empty name';
    if (!Number.isFinite(p.price) || p.price < 0) return 'invalid price';
    if (!Number.isInteger(p.stock) || p.stock < 0) return 'invalid stock';
    if (p.category_id !== null && Number.isNaN(p.category_id)) return 'invalid category_id';
    return null;
  }
}
