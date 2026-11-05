import { Component, effect, ElementRef, OnInit, signal, viewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../models/products/product.response';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import JsBarcode from 'jsbarcode';
import { ProductNotFoundComponent } from './product-not-found/product-not-found.component';

@Component({
  selector: 'app-product-detail-page',
  imports: [RouterLink, ProductNotFoundComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.css',
})
export class ProductDetailPage implements OnInit {
  constructor(
    private readonly productService: ProductService,
    private route: ActivatedRoute,
  ) {
    effect(() => {
      this.renderBarcode();
    });
  }
  protected isLoading = signal(false);
  protected error = signal(false);
  protected product = signal<ProductResponse | null>(null);
  protected readonly id = signal(0);
  //Html item
  public barcodeSvg = viewChild<ElementRef<SVGElement>>('barcodeSvg');
  ngOnInit(): void {
    this.isLoading.set(true);
    const urlId = this.route.snapshot.paramMap.get('id');
    const id = urlId ? Number.parseInt(urlId, 10) : Number.NaN;
    if (Number.isNaN(id) || id <= 0) {
      this.error.set(true);
      return;
    }
    this.id.set(id);
    this.loadProduct(this.id());
  }

  /**
   * Loads the product with that id
   * @param id the id of the product to load
   */
  private loadProduct(id: number): void {
    this.productService
      .getProductById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (p: ProductResponse) => {
          this.product.set(p);
        },
        error: (err) => {
          this.error.set(true);
        },
      });
  }

  /**
   * Renders the barcode using jsBarcode library
   */
  private renderBarcode(): void {
    const svg = this.barcodeSvg()?.nativeElement;
    const barcode = this.product()!.barcode;
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
