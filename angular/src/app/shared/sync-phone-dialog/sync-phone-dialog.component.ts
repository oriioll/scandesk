import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'app-sync-phone-dialog',
  imports: [],
  templateUrl: './sync-phone-dialog.component.html',
  styleUrl: './sync-phone-dialog.component.css',
})
export class SyncPhoneDialogComponent {
  public loadingQr: InputSignal<boolean> = input.required<boolean>();
  public createSession: OutputEmitterRef<void> = output<void>();
  public sessionError: InputSignal<string> = input.required<string>();
}
