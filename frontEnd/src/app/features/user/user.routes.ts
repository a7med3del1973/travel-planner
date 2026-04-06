import { Routes } from '@angular/router';
import { userGuard } from '../../core/guards/auth.guard';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-layout/user-layout').then((m) => m.UserLayoutComponent),
    canActivate: [userGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/user-dashboard').then((m) => m.UserDashboardComponent),
      },
      {
        path: 'destination/:id',
        loadComponent: () =>
          import('./destination-detail/destination-detail').then(
            (m) => m.DestinationDetailComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
