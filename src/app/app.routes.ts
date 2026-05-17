import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard'),
  },
  {
    path: 'executions',
    loadComponent: () => import('./pages/executions/executions'),
  },
  {
    path: 'comments',
    loadComponent: () => import('./pages/comments/comments'),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings'),
  },
];
