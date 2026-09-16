import { describe, expect, it, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
    let service: CatalogService;

    beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogService);
    });

    it('initializes the catalog service', () => {
    expect(service).toBeTruthy();
    });

    it('returns valid mock catalog items', () => {
    service.getCatalog().subscribe((games) => {
    expect(games.length).toBeGreaterThan(0);
    expect(games[0].title).toBeDefined();
    expect(games[0].price).toBeGreaterThan(0);
    });
    });
});