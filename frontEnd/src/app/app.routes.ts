import { Routes } from '@angular/router';
import { authGuard, adminGuard, userGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // Auth (public)
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },

  // Admin
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },

  // User
  {
    path: 'user',
    loadChildren: () =>
      import('./features/user/user.routes').then((m) => m.userRoutes),
  },

  // Fallback
  { path: '**', redirectTo: 'auth/login' },
];
