import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { CallbackComponent } from './core/auth/callback/callback';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'catalogo',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'callback',
    component: CallbackComponent,
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./catalog/catalog').then(m => m.Catalog),
    canActivate: [authGuard],
  },
  {
    path: 'biblioteca',
    loadComponent: () => import('./library/library').then(m => m.Library),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin').then(m => m.Admin),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'catalogo',
  },
];