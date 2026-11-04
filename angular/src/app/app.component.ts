import { Component, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { Header } from './shared/header/header.component';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { DrawerNavComponent } from './shared/header/drawer-nav/drawer-nav.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster, Header, MatSidenavModule, DrawerNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly title = signal('angular');
  //Drawer only for the dashboard pages
  readonly drawer = viewChild.required<MatDrawer>('drawer');
  protected readonly username = signal('');
  protected readonly email = signal('');
  protected readonly userLoading = signal(true);
  protected readonly userLoadError = signal(false);

  protected onUserLoaded(user: { name: string; email: string }): void {
    this.username.set(user.name);
    this.email.set(user.email);
  }

  /**
   * Completes the shared profile loading state for the header and drawer.
   * @param succeeded Whether the profile request succeeded.
   * @return void
   * @author Copilot
   * @since 2026-11-04
   * @throws Never throws.
   */
  protected onUserLoadFinished(succeeded: boolean): void {
    this.userLoading.set(false);
    this.userLoadError.set(!succeeded);
  }
}
