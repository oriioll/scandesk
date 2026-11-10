import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IconComponent, IconName } from '../../shared/icon/icon.component';
import { HeaderLogoComponent } from '../../shared/header/header-logo/header-logo.component';

interface Card {
  icon: IconName;
  title: string;
  text: string;
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink, IconComponent, HeaderLogoComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);

  readonly img = '/landing';
  readonly year = new Date().getFullYear();

  readonly checks = ['No scanner hardware', 'Works on any modern phone', 'Pairing in seconds'];

  readonly steps = [
    {
      title: 'Pair your phone',
      text: 'Open Scan or Checkout on your computer and read the QR code with your phone. One tap and you are connected.',
    },
    {
      title: 'Scan products',
      text: 'Point the camera at any barcode. The code reaches your computer instantly.',
    },
    {
      title: 'Manage or sell',
      text: 'Update stock, register new products, or build a sale and confirm it. All from your desk.',
    },
  ];

  readonly features: Card[] = [
    {
      icon: 'smartphone',
      title: 'Instant pairing',
      text: 'Pair with a QR code. Nothing to install and no account needed on the phone.',
    },
    {
      icon: 'scan',
      title: 'Scan mode',
      text: 'Find a product, adjust its stock or edit its details. Unknown barcode? The new-product form opens with the code filled in.',
    },
    {
      icon: 'cart',
      title: 'Checkout mode',
      text: 'Every scan adds a line to the sale. Totals are calculated for you and stock is deducted when you confirm.',
    },
    {
      icon: 'clock',
      title: 'Stock history',
      text: 'Every stock change is recorded, from sales to manual adjustments, so your numbers always add up.',
    },
    {
      icon: 'package',
      title: 'Product catalog',
      text: 'Keep products organized with prices and categories, and find any of them in seconds.',
    },
    {
      icon: 'file',
      title: 'Order history',
      text: 'Browse past orders. Prices are saved at the time of sale, so later edits never rewrite history.',
    },
  ];

  readonly showcase = [
    {
      kicker: 'Scan mode',
      title: 'Scan once, know everything',
      text: 'Point your phone at a barcode and the product shows up on your computer, ready to edit.',
      bullets: [
        'Adjust stock with a reason in a single step',
        'Edit name, price or category without leaving the page',
        'Unknown barcode? The new-product form opens already filled in',
      ],
      image: 'hero-desktop.png',
      alt: 'ScanDesk scan mode showing a scanned product with its stock',
    },
    {
      kicker: 'Checkout mode',
      title: 'Ring up sales at scanning speed',
      text: 'Every scan adds a line to the current sale. Review the list, check the total and confirm.',
      bullets: [
        'Running total while you scan',
        'Stock is deducted automatically when you confirm',
        'Protected against double submissions: a double click never creates two orders',
      ],
      image: 'checkout-mode.png',
      alt: 'ScanDesk checkout mode with a list of scanned items and the total',
    },
  ];

  readonly security: Card[] = [
    {
      icon: 'lock',
      title: 'Single-use QR codes',
      text: 'Each pairing QR can be claimed once and expires within minutes. An old screenshot is useless.',
    },
    {
      icon: 'shield',
      title: 'No login on the phone',
      text: 'Your phone never holds your credentials. It gets a limited token that can only send barcodes.',
    },
    {
      icon: 'eyeOff',
      title: 'Only barcodes travel',
      text: 'The camera feed is decoded on your phone. Only the barcode text is sent to your computer.',
    },
    {
      icon: 'clock',
      title: 'Sessions end when you leave',
      text: 'Close the page and the connection is torn down. Nothing stays paired in the background.',
    },
  ];

  readonly faqs = [
    {
      q: 'Do I need to install an app on my phone?',
      a: 'No. Scanning the QR code opens a web page in your phone browser. You only need to allow camera access.',
    },
    {
      q: 'Which phones are supported?',
      a: 'Any modern phone with a camera and an up-to-date browser, including Safari on iPhone and Chrome on Android.',
    },
    {
      q: 'Do I need a barcode scanner?',
      a: 'No. Your phone camera is the scanner. Common retail formats such as EAN-13 and UPC are supported.',
    },
    {
      q: 'Why do I have to pair every time?',
      a: 'On purpose. Pairing is not stored: each time you open Scan or Checkout you link your phone again. It is quick and keeps your session safe.',
    },
    {
      q: 'What if a product is not in my inventory?',
      a: 'In scan mode, the new-product form opens with the barcode already filled in, so you only add the name, price and stock.',
    },
    {
      q: 'What happens if I confirm a sale twice by mistake?',
      a: 'Nothing bad. Sales are processed as a single operation and protected against duplicates, so you never get two orders or double stock deductions.',
    },
    {
      q: 'Is it secure to link my phone?',
      a: 'Pairing uses short-lived, single-use codes, and the phone never gets access to your account. It can only send barcodes to your current session.',
    },
  ];

  ngAfterViewInit(): void {
    // Llegada desde otra página con fragmento (p. ej. /terms -> /#faq)
    const f = this.route.snapshot.fragment;
    if (f) document.getElementById(f)?.scrollIntoView();
  }

  goTo(e: Event, id: string): void {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** Si la captura aún no existe, se oculta y queda visible el placeholder con el nombre del archivo. */
  onImgError(e: Event): void {
    (e.target as HTMLImageElement).style.display = 'none';
  }
}
