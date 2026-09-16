import { Routes } from '@angular/router';
import { Catalog } from './catalog/catalog';
import { Library } from './library/library';
import { Admin } from './admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', component: Catalog },
  { path: 'library', component: Library },
  { path: 'admin', component: Admin },
];