import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { environment } from '../../environments/environment';
import { Game } from '../models/game.model';
import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  let service: CatalogService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogService, provideHttpClientTesting()],
    });

    service = TestBed.inject(CatalogService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('initializes the catalog service', () => {
    expect(service).toBeTruthy();
  });

  it('requests the catalog from the API Gateway', () => {
    const expectedGames: Game[] = [
      {
        id: '1',
        title: 'Super Adventure',
        description: 'An epic open-world exploration adventure.',
        price: 29.99,
        imageUrl: 'https://example.com/game.jpg',
      },
    ];

    service.getCatalog().subscribe((games) => {
      expect(games).toEqual(expectedGames);
    });

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/v1/catalogo`,
    );

    expect(request.request.method).toBe('GET');
    request.flush(expectedGames);
  });

  it('finds a game by id from the catalog response', () => {
    const expectedGames: Game[] = [
      {
        id: '1',
        title: 'Super Adventure',
        description: 'An epic open-world exploration adventure.',
        price: 29.99,
        imageUrl: 'https://example.com/game.jpg',
      },
    ];

    service.getGameById('1').subscribe((game) => {
      expect(game).toEqual(expectedGames[0]);
    });

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/v1/catalogo`,
    );

    expect(request.request.method).toBe('GET');
    request.flush(expectedGames);
  });

  it('returns undefined when the game does not exist', () => {
    const expectedGames: Game[] = [
      {
        id: '1',
        title: 'Super Adventure',
        description: 'An epic open-world exploration adventure.',
        price: 29.99,
        imageUrl: 'https://example.com/game.jpg',
      },
    ];

    service.getGameById('999').subscribe((game) => {
      expect(game).toBeUndefined();
    });

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/v1/catalogo`,
    );

    request.flush(expectedGames);
  });
});