import { Component, inject, signal, DestroyRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private breakpointObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);
  private swUpdate = inject(SwUpdate);

  isMobile = signal(false);
  sidenavOpened = signal(false);
  deferredPrompt = signal<any>(null);
  showInstallBanner = signal(false);

  constructor() {
    this.swUpdate.versionUpdates.subscribe((event) => {
      if (event.type === 'VERSION_READY') {
        const ok = confirm('Nueva versión disponible. ¿Recargar?');
        if (ok) window.location.reload();
      }
    });
    this.breakpointObserver
      .observe(['(max-width: 767.98px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.isMobile.set(result.matches);
        if (!result.matches) {
          this.sidenavOpened.set(true);
        } else {
          this.sidenavOpened.set(false);
        }
      });
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt.set(event);
      this.showInstallBanner.set(true);
    });
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt.set(null);
      this.showInstallBanner.set(false);
    });
  }

  toggleSidenav() {
    this.sidenavOpened.update((v) => !v);
  }

  closeSidenavOnMobile() {
    if (this.isMobile()) {
      this.sidenavOpened.set(false);
    }
  }

  installApp() {
    const prompt = this.deferredPrompt();
    if (!prompt) return;
    prompt.prompt();
    prompt.userChoice.then((result: { outcome: string }) => {
      if (result.outcome === 'accepted') {
        this.showInstallBanner.set(false);
      }
      this.deferredPrompt.set(null);
    });
  }

  dismissInstallBanner() {
    this.showInstallBanner.set(false);
    this.deferredPrompt.set(null);
  }
}
