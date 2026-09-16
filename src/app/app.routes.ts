import { Routes } from '@angular/router';
import { Catalog } from './catalog/catalog';
import { Library } from './library/library';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', component: Catalog },
  { path: 'library', component: Library },
];