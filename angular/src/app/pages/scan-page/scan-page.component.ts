import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { SyncService } from '../../services/sync.service';
import { SessionResponse } from '../../model/SessionResponse';
import { finalize } from 'rxjs';
import QRCode from 'qrcode';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { SyncPhoneDialogComponent } from '../../shared/sync-phone-dialog/sync-phone-dialog.component';
import { ScanService } from '../../services/scan.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-scan-page',
  imports: [QrCodeComponent, SyncPhoneDialogComponent],
  templateUrl: './scan-page.component.html',
  styleUrl: './scan-page.component.css',
})
export class ScanPage implements OnInit {
  public sessionData?: SessionResponse;
  public loadingQr = signal(false);
  public sessionError = signal('');
  public barcode = signal('');
  public barcodeReceived = signal(false);
  public qrUrl = signal('');
  public qrGenerated = signal(false);
  constructor(
    private syncService: SyncService,
    private scanService: ScanService,
    private destroyRef: DestroyRef,
  ) {}

  /**
   * Listener of ws event when getting a barcode scanned
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
   * Handles when the button to create session is clicked
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
   * Generates a link of a qr code image
   * @param url The url to get the qr image from
   * @returns Promise<string> - The link of the qr code image generated
   */
  private async getQrLink(url: string): Promise<string> {
    return await QRCode.toDataURL(url, { width: 256, margin: 2, errorCorrectionLevel: 'M' });
  }

  private handleBarcodeScanned(barcode: string) {
    if (this.barcodeReceived()) {
      return;
    }
    this.barcodeReceived.set(true);
    this.barcode.set(barcode);
    //Set from
  }
  private resetSessionError() {
    setTimeout(() => {
      this.sessionError.set('');
    }, 3000);
  }

  public onProductFormSubmit() {}
}
