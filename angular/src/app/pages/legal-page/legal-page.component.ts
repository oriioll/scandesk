import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface LegalSection {
  heading: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
}

interface StoredDataItem {
  name: string;
  storage: string;
  purpose: string;
  duration: string;
}

interface LegalDocument {
  title: string;
  introduction: string;
  sections: readonly LegalSection[];
  storedData?: readonly StoredDataItem[];
}

const LEGAL_DOCUMENTS = {
  terms: {
    title: 'Terms of service',
    introduction:
      'These terms describe the rules for using ScanDesk, an application for managing product inventory and recording orders.',
    sections: [
      {
        heading: 'What ScanDesk does',
        paragraphs: [
          'ScanDesk lets you manage product details and stock, record orders, review stock changes, and pair a phone to scan barcodes.',
          'The app records order information. It does not process payments or provide accounting, tax, or legal advice. Payments and fulfillment for sales to your customers take place outside ScanDesk.',
        ],
      },
      {
        heading: 'Your account',
        paragraphs: [
          'Provide accurate account details and keep your sign-in credentials private. You are responsible for activity carried out through your account. Contact us if you believe someone else has accessed it.',
        ],
      },
      {
        heading: 'Your records and acceptable use',
        paragraphs: [
          'You are responsible for the accuracy and lawfulness of the product, stock, and order information you enter, and for keeping any independent copies you need.',
          'Do not use ScanDesk unlawfully, interfere with its operation, or attempt to access another user’s account or data.',
        ],
      },
      {
        heading: 'Availability and changes',
        paragraphs: [
          'Features may change as the application is maintained. Nothing in these terms limits rights that cannot be limited under applicable law.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: ['For questions about these terms, email Oriol Plazas at oriolplazas2@gmail.com.'],
      },
    ],
  },
  policy: {
    title: 'Privacy policy',
    introduction:
      'This policy describes personal information that ScanDesk processes to provide account, inventory, order-recording, and phone-pairing features.',
    sections: [
      {
        heading: 'Who operates ScanDesk',
        paragraphs: [
          'ScanDesk is operated by Oriol Plazas. For privacy requests, contact oriolplazas2@gmail.com.',
        ],
      },
      {
        heading: 'Information processed',
        items: [
          'Account details: name and email address. Passwords are stored by the API as one-way hashes.',
          'Inventory details: product names, barcodes, categories, prices, and stock quantities.',
          'Order records: product names, quantities, unit prices, totals, and timestamps.',
          'Stock history: recorded product changes and timestamps.',
          'Phone pairing and authentication data: temporary pairing-session details and account access tokens.',
          'Technical session data may include an IP address and browser user-agent when server-side sessions are used.',
        ],
      },
      {
        heading: 'How information is used',
        paragraphs: [
          'Information is used to create and authenticate accounts, save and display inventory and order records, provide phone pairing, and operate the service.',
        ],
      },
      {
        heading: 'Service providers',
        paragraphs: [
          'The frontend is hosted on Vercel and the API is hosted on Render. The site also requests fonts and Material Icons from Google Fonts. These services receive the connection information needed to deliver their resources.',
        ],
      },
      {
        heading: 'Retention',
        paragraphs: [
          'Account and related records are retained while the account is active and for any legal retention period that applies after account closure. To request account or data deletion, email oriolplazas2@gmail.com.',
        ],
      },
      {
        heading: 'Your choices and rights',
        paragraphs: [
          'Where data-protection law applies, you may have rights to access, correct, erase, or restrict your personal data, to receive a portable copy, and to object to certain processing. If processing is based on consent, you may withdraw that consent.',
          'Contact oriolplazas2@gmail.com to make a request. You may also complain to your competent data-protection authority.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookie policy',
    introduction:
      'The ScanDesk frontend uses browser storage for account authentication and a saved theme preference. These entries are local storage, not HTTP cookies.',
    storedData: [
      {
        name: 'access_token',
        storage: 'Local storage',
        purpose: 'Authenticates requests made for your account.',
        duration: 'Until logout or browser site data is cleared.',
      },
      {
        name: 'scandesk-theme',
        storage: 'Local storage',
        purpose: 'Remembers a manually selected light or dark theme.',
        duration: 'Until you select System or clear browser site data.',
      },
    ],
    sections: [
      {
        heading: 'Cookies and similar technologies',
        paragraphs: [
          'The frontend source does not configure analytics or advertising cookies. Hosting or server components may use strictly necessary technical cookies; check the deployed service before relying on this statement as a complete cookie inventory.',
        ],
      },
      {
        heading: 'External fonts and icons',
        paragraphs: [
          'ScanDesk requests font and Material Icons files from Google Fonts. Those requests disclose ordinary connection data, such as your IP address and browser information, to Google so it can deliver the files.',
        ],
      },
      {
        heading: 'Managing browser storage',
        paragraphs: [
          'Logging out removes the account access token. Selecting the System theme removes the saved theme preference. You can also clear ScanDesk site data in your browser settings.',
        ],
      },
      {
        heading: 'Consent',
        paragraphs: [
          'No analytics or advertising tracker is configured in the frontend source, so this page does not add a cookie-consent banner. The legal treatment of browser storage and third-party font requests depends on the deployed setup and applicable law and should be confirmed before launch.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: ['For questions about this policy, email Oriol Plazas at oriolplazas2@gmail.com.'],
      },
    ],
  },
} satisfies Record<'terms' | 'policy' | 'cookies', LegalDocument>;

/**
 * Renders the legal document associated with the active route.
 * @author Oriol Plazas
 * @since 2026-11-22
 */
@Component({
  selector: 'app-legal-page',
  imports: [RouterLink],
  templateUrl: './legal-page.component.html',
  styleUrl: './legal-page.component.css',
})
export class LegalPageComponent {
  readonly page: LegalDocument;

  constructor() {
    const path = inject(ActivatedRoute).snapshot.routeConfig?.path;

    if (path === 'terms' || path === 'policy' || path === 'cookies') {
      this.page = LEGAL_DOCUMENTS[path];
      return;
    }

    throw new Error(`No legal document is configured for route "${path ?? ''}".`);
  }
}
