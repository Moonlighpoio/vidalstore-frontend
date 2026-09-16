import { describe, expect, it } from 'vitest';
import { routes } from './app.routes';

describe('App Routes', () => {
    const registeredPaths = routes.map((r) => r.path);

    it('declares catalog, library, and admin paths', () => {
    expect(registeredPaths).toContain('catalog');
    expect(registeredPaths).toContain('library');
    expect(registeredPaths).toContain('admin');
    });

    it('redirects empty root to catalog', () => {
    const rootRoute = routes.find((r) => r.path === '');
    expect(rootRoute?.redirectTo).toBe('catalog');
    expect(rootRoute?.pathMatch).toBe('full');
    });
});