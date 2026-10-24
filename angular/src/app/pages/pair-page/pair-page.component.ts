import { Component, OnInit, signal, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SyncService } from '../../services/sync.service';
import { finalize } from 'rxjs';
import { BarcodeScannerComponent } from '../../shared/barcode-scanner/barcode-scanner.component';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';
import { ScanService } from '../../services/scan.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-pair-page',
  imports: [BarcodeScannerComponent, SkeletonComponent],
  templateUrl: './pair-page.component.html',
  styleUrl: './pair-page.component.css',
})
export class PairPage implements OnInit {
  private session_token = signal<string>('');
  //UX-UI VARIABLES
  public token_error = signal<boolean>(false);
  public session_error = signal<boolean>(false);
  public session_exists = signal<boolean>(false);
  public loading = signal<boolean>(false);
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private syncService: SyncService,
    private scanService: ScanService,
  ) {}
  ngOnInit(): void {
    this.loading.set(true);
    if (!this.parseTokenHash()) {
      this.loading.set(false);
      return;
    }
    this.verifySession();
  }
  /**
   * Gets the token from the hash in the url and updated session_token signal
   * @returns boolean if token was parsed successfully or not
   */
  private parseTokenHash(): boolean {
    this.token_error.set(false);
    //Get the token from url hash (#)
    this.session_token.set(this.route.snapshot.fragment || '');
    if (this.session_token().length === 0) {
      this.token_error.set(true);
      return false;
    }
    //Remove token from url
    this.location.replaceState(this.location.path());
    return true;
  }

  /**
   * Verifies if the session with the token gotten exists
   * using sync service
   */
  private verifySession(): void {
    this.syncService
      .verifySession(this.session_token())
      .pipe(finalize(() => this.loading.set(false))) //Loading state
      .subscribe({
        next: () => {
          this.session_exists.set(true);
          //Join session
          this.scanService.joinSession(this.session_token());
        },
        error: (e) => {
          this.session_error.set(true);
        },
      });
  }

  /**
   * When the camera scans a barcode use scanService to send the barcode
   * @param barcode The barcode scanned
   */
  public onBarcodeScanned(barcode: string) {
    this.scanService.sendBarcode(barcode);
    toast.success('Barcode sent successfully!');
  }
}
