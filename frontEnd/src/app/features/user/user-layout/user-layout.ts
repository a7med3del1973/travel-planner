import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class UserLayoutComponent {
  readonly authStore = inject(AuthStore);

  logout(): void {
    this.authStore.logout();
  }
}
