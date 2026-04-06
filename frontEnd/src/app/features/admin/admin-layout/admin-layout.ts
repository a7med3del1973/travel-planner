import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class AdminLayoutComponent {
  readonly authStore = inject(AuthStore);

  navItems = [
    { label: 'Dashboard', icon: 'fa-solid fa-chart-pie', path: '/admin/dashboard' },
    { label: 'Destinations', icon: 'fa-solid fa-map-location-dot', path: '/admin/destinations' },
    { label: 'Fetch from API', icon: 'fa-solid fa-cloud-arrow-down', path: '/admin/fetch-api' },
  ];

  logout(): void {
    this.authStore.logout();
  }
}
