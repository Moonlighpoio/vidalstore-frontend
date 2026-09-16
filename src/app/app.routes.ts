import { Routes } from '@angular/router';
import { Catalog } from './catalog/catalog';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', component: Catalog },
];