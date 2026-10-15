import { Component, OnInit, signal } from '@angular/core';
import { SyncService } from '../../services/sync.service';
import { SessionResponse } from '../../model/SessionResponse';
import { finalize } from 'rxjs';
import QRCode from 'qrcode';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { SyncPhoneDialogComponent } from '../../shared/sync-phone-dialog/sync-phone-dialog.component';

@Component({
  selector: 'app-scan-page',
  imports: [QrCodeComponent, SyncPhoneDialogComponent],
  templateUrl: './scan-page.component.html',
  styleUrl: './scan-page.component.css',
})
export class ScanPage {
  public sessionData?: SessionResponse;
  public loadingQr = signal(false);
  public errorMessage = signal('');
  public qrUrl = signal('');
  public qrGenerated = signal(false);
  constructor(private syncService: SyncService) {}

  /**
   * Handles when the button to create session is clicked
   */
  public onCreateSession() {
    //UI-UX States
    this.qrGenerated.set(false);
    this.loadingQr.set(true);
    this.errorMessage.set('');

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
          this.sessionData = res;
          //Create code with that session
          const url: string = await this.getQrLink('http://localhost/pair#' + res.token_hash);
          this.qrUrl.set(url);
          this.qrGenerated.set(true);
        },
        error: (err) => {
          this.errorMessage.set("Couldn't create a session, please try again later");
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
}
