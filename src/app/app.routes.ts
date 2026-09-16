import { Routes } from '@angular/router';

import { Admin } from './admin/admin';
import { Catalog } from './catalog/catalog';
import { Library } from './library/library';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'catalogo',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/login/login').then(
        (module) => module.LoginComponent,
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./core/auth/register/register').then(
        (module) => module.RegisterComponent,
      ),
  },
  {
    path: 'catalogo',
    component: Catalog,
    canActivate: [authGuard],
  },
  {
    path: 'biblioteca',
    component: Library,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['administradores'],
    },
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./shared/forbidden/forbidden').then(
        (module) => module.ForbiddenComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'catalogo',
  },
];