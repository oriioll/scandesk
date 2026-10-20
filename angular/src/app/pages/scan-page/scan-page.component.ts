import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { SyncService } from '../../services/sync.service';
import { SessionResponse } from '../../model/SessionResponse';
import { finalize } from 'rxjs';
import QRCode from 'qrcode';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { SyncPhoneDialogComponent } from '../../shared/sync-phone-dialog/sync-phone-dialog.component';
import { ScanService } from '../../services/scan.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../model/ProductResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductFormComponent } from '../../shared/product-form/product-form.component';

import { toast } from 'ngx-sonner';
import { ProductRequest } from '../../model/ProductRequest';

@Component({
  selector: 'app-scan-page',
  imports: [QrCodeComponent, SyncPhoneDialogComponent, ProductFormComponent],
  templateUrl: './scan-page.component.html',
  styleUrl: './scan-page.component.css',
})
export class ScanPage implements OnInit {
  public sessionData?: SessionResponse;
  // UX/UI state for pairing feedback.
  public loadingQr = signal(false);
  public sessionError = signal('');

  // UX/UI state for scanned barcodes.
  public barcode = signal('');
  public barcodeReceived = signal(false);

  // UX/UI state for the QR preview.
  public qrUrl = signal('');
  public qrGenerated = signal(false);

  // UX/UI state for product lookup and form feedback.
  public formOperation = signal<'insert' | 'update'>('insert');
  public productToUpdateId = signal<number | null>(null);
  public loadingProduct = signal(false);
  public submitting = signal(false);
  public formError = signal('');
  public lookupFailed = signal(false);
  public product = signal<ProductResponse | null>(null);
  public fieldErrors = signal<Record<string, string>>({});
  constructor(
    private syncService: SyncService,
    private scanService: ScanService,
    private productService: ProductService,
    private destroyRef: DestroyRef,
  ) {}

  /**
   * Subscribes to barcode scan events.
   * @returns void
   */
  ngOnInit(): void {
    this.scanService
      .onReceiveBarcode()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((barcode) => {
        this.handleBarcodeScanned(barcode);
      });
  }
  /**
   * Creates a pairing session and generates its QR code.
   * @returns void
   */
  public onCreateSession() {
    //UI-UX States
    this.qrGenerated.set(false);
    this.loadingQr.set(true);
    this.sessionError.set('');

    //API Request
    this.syncService
      .createSession()
      .pipe(
        finalize(() => {
          this.loadingQr.set(false);
        }),
      )
      .subscribe({
        next: async (res) => {
          try {
            this.sessionData = res;
            const url: string = await this.getQrLink(
              'https://speculative-glynis-trusting.ngrok-free.dev/pair#' + res.token_hash,
            );
            this.scanService.joinSession(res.token_hash);
            this.qrUrl.set(url);
            this.qrGenerated.set(true);
          } catch (error) {
            this.sessionError.set("Couldn't prepare the pairing code, please try again.");
            this.resetSessionError();
          }
        },
        error: (err) => {
          this.sessionError.set("Couldn't create a session, please try again later");
          this.resetSessionError();
        },
      });
  }

  /**
   * Generates a QR code image URL.
   * @param url The URL encoded in the QR code.
   * @returns The generated QR code image URL.
   */
  private async getQrLink(url: string): Promise<string> {
    return await QRCode.toDataURL(url, { width: 256, margin: 2, errorCorrectionLevel: 'M' });
  }

  /**
   * Stores a scanned barcode and starts its product lookup.
   * @param barcode The scanned product barcode.
   * @returns void
   */
  private handleBarcodeScanned(barcode: string) {
    if (this.barcodeReceived()) {
      return;
    }
    this.barcodeReceived.set(true);
    this.barcode.set(barcode);
    this.setFormMode(this.barcode());
  }

  /**
   * Clears the pairing error after three seconds.
   * @returns void
   */
  private resetSessionError() {
    setTimeout(() => {
      this.sessionError.set('');
    }, 3000);
  }

  /**
   * Looks up a product and sets the form mode based on the result.
   * @param barcode The product barcode to look up.
   * @returns void
   */
  public setFormMode(barcode: string) {
    this.loadingProduct.set(true);
    this.lookupFailed.set(false);
    this.formError.set('');
    this.productService
      .getProductByBarcode(barcode)
      .pipe(
        finalize(() => {
          this.loadingProduct.set(false);
        }),
      )
      .subscribe({
        next: (product: ProductResponse) => {
          this.productToUpdateId.set(product.id);
          this.formOperation.set('update');
          this.product.set(product);
        },
        error: (err) => {
          if (err.status === 404) {
            this.formOperation.set('insert');
            return;
          }
          this.lookupFailed.set(true);
          this.formError.set("Couldn't check this barcode, please try again.");
        },
      });
  }

  /**
   * Creates or updates the product using the form values.
   * @param value The validated product form values.
   * @returns void
   */
  public onProductFormSubmit(value: ProductRequest) {
    if (this.submitting() || this.loadingProduct() || this.lookupFailed()) {
      return;
    }
    this.formError.set('');
    this.fieldErrors.set({});
    this.submitting.set(true);
    if (this.formOperation() === 'insert') {
      this.productService
        .postProduct(value)
        .pipe(finalize(() => this.submitting.set(false)))
        .subscribe({
          next: (created: ProductResponse) => {
            this.productToUpdateId.set(created.id);
            this.formOperation.set('update');
            this.product.set(created);
            toast.success('Product created');
          },
          error: (err: HttpErrorResponse) => this.handleSubmitError(err),
        });
    } else {
      this.productService
        .putProduct(this.productToUpdateId()!!, value)
        .pipe(finalize(() => this.submitting.set(false)))
        .subscribe({
          next: () => {
            toast.success('Changes saved');
          },
          error: (err: HttpErrorResponse) => this.handleSubmitError(err),
        });
    }
  }

  /**
   * Displays the appropriate message for a product submission error.
   * @param err The HTTP error returned by the API.
   * @returns void
   */
  private handleSubmitError(err: HttpErrorResponse) {
    if (err.status === 0) {
      this.formError.set('No connection. Check your network and try again.');
    } else if (err.status === 409) {
      this.formError.set('A product with this barcode already exists.');
    } else if (err.status === 422) {
      const visible = ['name', 'price', 'stock'];
      const fields: Record<string, string> = {};
      const rest: string[] = [];
      for (const [field, msgs] of Object.entries<string[]>(err.error?.errors ?? {})) {
        if (visible.includes(field)) fields[field] = msgs[0];
        else rest.push(msgs[0]);
      }
      this.fieldErrors.set(fields);
      if (rest.length) this.formError.set(rest.join(' '));
    } else {
      this.formError.set("Couldn't save the product, please try again later.");
    }
  }
}
