import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from '../models/auth.model';

const STORAGE_KEY = 'travel_planner_auth';

function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly router = inject(Router);

  private readonly _user = signal<AuthUser | null>(this.loadFromStorage());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());
  readonly isAdmin = computed(() => this._user()?.role === 'ADMIN');
  readonly isUser = computed(() => this._user()?.role === 'USER');
  readonly token = computed(() => this._user()?.token ?? null);
  readonly username = computed(() => this._user()?.username ?? null);
  readonly userId = computed(() => this._user()?.userId ?? null);

  setUser(user: AuthUser): void {
    const payload = decodeJwt(user.token);
    const userId = payload ? (payload['id'] as number) ?? (payload['sub'] ? parseInt(payload['sub'] as string, 10) : undefined) : undefined;
    const enriched: AuthUser = { ...user, userId: isNaN(userId as number) ? undefined : userId };
    this._user.set(enriched);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/auth/login']);
  }

  private loadFromStorage(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const user = JSON.parse(raw) as AuthUser;
      const payload = decodeJwt(user.token);
      if (!payload) return null;
      const exp = payload['exp'] as number;
      if (exp && Date.now() / 1000 > exp) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return user;
    } catch {
      return null;
    }
  }
}
