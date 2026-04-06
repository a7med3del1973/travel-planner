import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/auth.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-layout/admin-layout').then((m) => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/admin-dashboard').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'destinations',
        loadComponent: () =>
          import('./destinations/admin-destinations').then((m) => m.AdminDestinationsComponent),
      },
      {
        path: 'fetch-api',
        loadComponent: () =>
          import('./fetch-api/fetch-api').then((m) => m.FetchApiComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
