import {
  Component,
  AfterViewInit,
  OnDestroy,
  output,
  signal,
  viewChild,
  ElementRef,
} from '@angular/core';
import { BarcodeDetector } from 'barcode-detector/ponyfill';
import { SkeletonComponent } from '../skeleton/skeleton.component';

// Deben coincidir con width/height de .frame en el CSS (80% x 35%)
const FRAME_W = 0.8;
const FRAME_H = 0.35;
const SCAN_INTERVAL_MS = 150;
const DEBOUNCE_MS = 1500;
const SUCCESS_FEEDBACK_MS = 3000;

@Component({
  selector: 'app-barcode-scanner',
  imports: [SkeletonComponent],
  templateUrl: './barcode-scanner.component.html',
  styleUrl: './barcode-scanner.component.css',
})
export class BarcodeScannerComponent implements AfterViewInit, OnDestroy {
  private videoRef = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  public scanned = output<string>();
  public cameraError = output<string>();
  public loading = signal(true);
  public cameraErrorMessage = signal<string | null>(null);
  public scanSuccessful = signal(false);

  private stream?: MediaStream;
  private timer?: ReturnType<typeof setTimeout>;
  private successTimer?: ReturnType<typeof setTimeout>;
  private destroyed = false;
  private loopStarted = false;
  private detector = new BarcodeDetector({
    formats: ['qr_code', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'],
  });
  private canvas = document.createElement('canvas');
  private last = { code: '', at: 0 };
  private lastDetectionError: string | null = null;

  /**
   * Starts the camera after checking media access and permissions.
   * @returns Resolves when camera startup completes.
   */
  async ngAfterViewInit(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.reportCameraError(
        'Camera access is unavailable. Open ScanDesk over HTTPS and try again.',
      );
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
    } catch (error) {
      const name = error instanceof Error ? error.name : '';
      let message = 'Could not start the camera';
      if (name === 'NotAllowedError') {
        message =
          'Camera permission was denied. Allow camera access in your browser settings, then reload this page.';
      } else if (name === 'NotFoundError') {
        message = 'No camera was found on this device.';
      } else if (name === 'NotReadableError') {
        message =
          'The camera is already in use or unavailable. Close other apps using it and try again.';
      }
      this.reportCameraError(message);
      return;
    }
    if (this.destroyed) {
      this.stopStream();
      return;
    }
    const v = this.videoRef().nativeElement;
    v.srcObject = this.stream;
    try {
      await v.play();
    } catch (error) {
      this.stopStream();
      this.reportCameraError(
        'Could not start the camera. Check your browser permissions and try again.',
      );
      return;
    }
    this.stream.getVideoTracks()[0]?.addEventListener('ended', () => {
      this.reportCameraError('The camera stopped unexpectedly. Check the device and try again.');
    });
    this.loading.set(false);
    void this.loop();
  }

  private loop = async () => {
    if (this.destroyed) return;
    if (!this.loopStarted) {
      this.loopStarted = true;
    }
    try {
      const v = this.videoRef().nativeElement;
      if (v.videoWidth) {
        const scale = Math.max(v.clientWidth / v.videoWidth, v.clientHeight / v.videoHeight);
        const visW = v.clientWidth / scale;
        const visH = v.clientHeight / scale;
        const sw = visW * FRAME_W;
        const sh = visH * FRAME_H;
        const sx = (v.videoWidth - visW) / 2 + (visW - sw) / 2;
        const sy = (v.videoHeight - visH) / 2 + (visH - sh) / 2;
        this.canvas.width = sw;
        this.canvas.height = sh;
        this.canvas.getContext('2d')!.drawImage(v, sx, sy, sw, sh, 0, 0, sw, sh);
        const [hit] = await this.detector.detect(this.canvas);
        this.lastDetectionError = null;
        const now = Date.now();
        if (hit && (hit.rawValue !== this.last.code || now - this.last.at > DEBOUNCE_MS)) {
          this.last = { code: hit.rawValue, at: now };
          this.flashSuccess();
          this.scanned.emit(hit.rawValue);
        }
      }
    } catch (e) {
      const message = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
      if (message !== this.lastDetectionError) {
        this.lastDetectionError = message;
      }
    } finally {
      if (!this.destroyed) this.timer = setTimeout(this.loop, SCAN_INTERVAL_MS);
    }
  };

  /**
   * Shows local confirmation that a code was detected, independently of the network.
   * @returns void
   */
  private flashSuccess(): void {
    clearTimeout(this.successTimer);
    this.scanSuccessful.set(true);
    this.successTimer = setTimeout(() => this.scanSuccessful.set(false), SUCCESS_FEEDBACK_MS);
  }

  /**
   * Stops the camera
   */
  ngOnDestroy(): void {
    this.destroyed = true;
    clearTimeout(this.timer);
    clearTimeout(this.successTimer);
    this.stopStream();
  }

  /**
   * Releases and stops camera
   */
  private stopStream(): void {
    this.stream?.getTracks().forEach((t) => t.stop());
  }

  /**
   * Updates the component error state and notifies existing output listeners.
   * @param message Error details to display.
   * @returns void
   */
  private reportCameraError(message: string): void {
    this.cameraErrorMessage.set(message);
    this.loading.set(false);
    this.cameraError.emit(message);
  }
}
