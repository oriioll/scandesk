import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScanService {
  private readonly socket = io({ autoConnect: false });
  private sessionToken?: string;
  constructor() {
    this.socket.on('connect', () => {
      if (this.sessionToken) this.socket.emit('join-session', this.sessionToken); // re-join
    });
    this.socket.connect();
  }

  /**
   * Joins a session of ws
   * @param sessionToken The session token to join
   */
  public joinSession(sessionToken: string) {
    this.sessionToken = sessionToken;
    if (this.socket.connected) {
      this.socket.emit('join-session', sessionToken);
    }
  }

  /**
   * Sends a barcode scanned to ws via send-barcode-scanned event
   * @param barcode The barcode of the product scanned
   */
  public sendBarcode(barcode: string) {
    this.socket.emit('send-barcode-scanned', { barcode });
  }

  /**
   * Listens to receive-barcode-scanned ws event to get the barcode
   * @returns Observable<string> with the barcode scanned
   */
  public onReceiveBarcode(): Observable<string> {
    return new Observable<string>((subscriber) => {
      //Observable subscribes to barcode as a string
      const handler = (barcode: string) => {
        subscriber.next(barcode);
      };
      this.socket.on('receive-barcode-scanned', handler);
      //Clean listener
      return () => this.socket.off('receive-barcode-scanned', handler);
    });
  }
}
