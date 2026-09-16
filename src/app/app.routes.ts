import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Rutas públicas
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./core/auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./shared/forbidden/forbidden').then(m => m.ForbiddenComponent)
  },

  // Rutas protegidas
  {
    path: 'catalogo',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['jugadores', 'editores', 'administradores'] },
    loadComponent: () => import('./shared/catalogo-demo/catalogo').then(m => m.CatalogoDemoComponent)
  },
  {
    path: 'biblioteca',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['jugadores', 'editores', 'administradores'] },
    loadComponent: () => import('./shared/catalogo-demo/catalogo').then(m => m.CatalogoDemoComponent) // placeholder
  },
  {
    path: 'editor',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['editores', 'administradores'] },
    loadComponent: () => import('./shared/catalogo-demo/catalogo').then(m => m.CatalogoDemoComponent) // placeholder
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['administradores'] },
    loadComponent: () => import('./shared/catalogo-demo/catalogo').then(m => m.CatalogoDemoComponent) // placeholder
  },

  // Redirección por defecto
  {
    path: '',
    redirectTo: 'catalogo',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'catalogo'
  }
];