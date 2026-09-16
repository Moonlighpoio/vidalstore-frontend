import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./core/auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./shared/catalogo-demo/catalogo').then(m => m.CatalogoDemoComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];