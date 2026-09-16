import { describe, expect, it } from 'vitest';
import { routes } from './app.routes';

describe('App Routes', () => {
  it('declares catalog, library, and admin paths', () => {
    const registeredPaths = routes.map((route) => route.path);

    expect(registeredPaths).toContain('catalogo');
    expect(registeredPaths).toContain('biblioteca');
    expect(registeredPaths).toContain('admin');
  });

  it('declares authentication and forbidden paths', () => {
    const registeredPaths = routes.map((route) => route.path);

    expect(registeredPaths).toContain('login');
    expect(registeredPaths).toContain('register');
    expect(registeredPaths).toContain('forbidden');
  });

  it('protects catalog and library routes', () => {
    const catalogRoute = routes.find((route) => route.path === 'catalogo');
    const libraryRoute = routes.find((route) => route.path === 'biblioteca');

    expect(catalogRoute?.canActivate).toBeDefined();
    expect(libraryRoute?.canActivate).toBeDefined();
  });

  it('protects the admin route with the administrator role', () => {
    const adminRoute = routes.find((route) => route.path === 'admin');

    expect(adminRoute?.canActivate).toBeDefined();
    expect(adminRoute?.data?.['roles']).toContain('administradores');
  });

  it('redirects the empty root to catalogo', () => {
    const rootRoute = routes.find((route) => route.path === '');

    expect(rootRoute?.redirectTo).toBe('catalogo');
    expect(rootRoute?.pathMatch).toBe('full');
  });
});