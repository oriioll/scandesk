import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { HeaderVariant } from '../../models/header/header-variant';
import { filter, map } from 'rxjs';
import { HeaderLandingComponent } from './header-landing/header-landing.component';
import { HeaderAuthComponent } from './header-auth/header-auth.component';
import { HeaderDashboardComponent } from './header-dashboard/header-dashboard.component';

@Component({
  selector: 'app-header',
  imports: [HeaderLandingComponent, HeaderAuthComponent, HeaderDashboardComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class Header {
  private router = inject(Router);

  /**
   * Handle what type of header display based on what router page you are
   */
  readonly variant = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.readVariant()),
    ),
    { initialValue: 'none' as HeaderVariant },
  );

  private readVariant(): HeaderVariant {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return (route.data['header'] as HeaderVariant | undefined) ?? 'none';
  }
}
