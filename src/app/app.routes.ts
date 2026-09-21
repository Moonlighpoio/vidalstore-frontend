import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
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
    path: 'register',
    loadComponent: () => import('./core/auth/register/register').then(m => m.RegisterComponent),
  },
  {
    path: 'callback',
    component: CallbackComponent,
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./shared/forbidden/forbidden').then(m => m.ForbiddenComponent),
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
    canActivate: [authGuard, roleGuard],
    data: { roles: ['administradores'] },
  },
  {
    path: '**',
    redirectTo: 'catalogo',
  },
];