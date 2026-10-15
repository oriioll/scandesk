import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-qr-code',
  imports: [],
  templateUrl: './qr-code.component.html',
  styleUrl: './qr-code.component.css',
})
export class QrCodeComponent {
  public qrUrl: InputSignal<string> = input.required<string>();
}
