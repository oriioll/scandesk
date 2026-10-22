import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { SyncService } from '../../services/sync.service';
import { SessionResponse } from '../../model/SessionResponse';
import { finalize } from 'rxjs';
import QRCode from 'qrcode';
import { SyncPhoneDialogComponent } from '../../shared/sync-phone-dialog/sync-phone-dialog.component';
import { ScanService } from '../../services/scan.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../model/ProductResponse';
import { HttpErrorResponse } from '@angular/common/http';

import { toast } from 'ngx-sonner';
import { QrCodeComponent } from '../scan-page/qr-code/qr-code.component';
import { CartItem } from '../../model/CartItem';
import { CheckoutCartComponent } from '../../shared/checkout-cart/checkout-cart.component';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout-page',
  imports: [QrCodeComponent, SyncPhoneDialogComponent, CheckoutCartComponent],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
})
export class CheckoutPage implements OnInit {
  public sessionData?: SessionResponse;
  // UX/UI state for pairing feedback.
  public loadingQr = signal(false);
  public sessionError = signal('');

  // UX/UI state for the QR preview.
  public qrUrl = signal('');
  public qrGenerated = signal(false);

  //Checkout cart
  public cart = signal<CartItem[]>([]);
  public submitting = signal(false);
  private idempotencyKey = crypto.randomUUID();

  constructor(
    private syncService: SyncService,
    private scanService: ScanService,
    private productService: ProductService,
    public orderService: OrderService,
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
        this.addByBarcode(barcode);
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
            console.log(
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
   * Adds a product to the cart (if exists)
   * @param barcode The barcode to add to cart
   */
  private addByBarcode(barcode: string) {
    this.productService.getProductByBarcode(barcode).subscribe({
      next: (p) => this.addToCart(p),
      error: (err: HttpErrorResponse) =>
        toast.error(
          err.status === 404 ? `Unknown barcode ${barcode}` : "Couldn't look up the product",
        ),
    });
  }

  /**
   * Adds a product to the checkout cart
   * @param product Product to add to the cart checkout
   * @returns
   */
  private addToCart(product: ProductResponse) {
    //Check if product exists in the cart and get its quantity
    const inCart = this.cart().find((item: CartItem) => item.id === product.id)?.quantity ?? 0;

    //Check if product has stock
    if (inCart >= product.stock) {
      toast.error(`No more stock of ${product.name}`);
      return;
    }
    this.cart.update((items) =>
      inCart
        ? //If item is in the cart, add +1 to its quantity
          items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        : //If item isn't in the card, add it with quantity one
          [
            ...items,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              stock: product.stock,
              quantity: 1,
            },
          ],
    );
  }

  /**
   * When item is removed from cart checkout
   */
  public onRemove(id: number) {
    this.cart.update((items) => items.filter((i) => i.id !== id));
  }

  public onCheckout() {
    //Verify if its possible to submit
    if (this.submitting() || this.cart().length === 0) return;
    this.submitting.set(true);

    const items = this.cart().map((i) => ({ product_id: i.id, quantity: i.quantity }));
    //Use orderservice to post the order
    this.orderService
      .postOrder(items, this.idempotencyKey)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.cart.set([]);
          this.idempotencyKey = crypto.randomUUID(); // new key only after a successful order
          toast.success('Order confirmed');
        },
        error: (err: HttpErrorResponse) =>
          toast.error(
            err.status === 422
              ? (err.error?.message ?? 'Not enough stock')
              : "Couldn't process the order, please try again.",
          ),
      });
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
}
