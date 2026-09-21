import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { environment } from '../../environments/environment';
import { Purchase } from '../models/purchase.model';
import { LibraryService } from './library.service';

describe('LibraryService', () => {
  let service: LibraryService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LibraryService, provideHttpClientTesting()],
    });

    service = TestBed.inject(LibraryService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('initializes the library service', () => {
    expect(service).toBeTruthy();
  });

  it('requests the user library from the API Gateway', () => {
    const apiResponse = {
      userId: 'usr-demo-01',
      total: 1,
      licenses: [
        {
          id: 'LIC-ADV-8492',
          userId: 'usr-demo-01',
          gameId: '1',
          gameTitle: 'Super Adventure',
          purchasedAt: '2026-09-01T10:00:00.000Z',
          revoked: false,
        },
      ],
    };

    const expectedLibrary: Purchase[] = [
      {
        id: 'LIC-ADV-8492',
        gameId: '1',
        gameTitle: 'Super Adventure',
        userId: 'usr-demo-01',
        timestamp: new Date('2026-09-01T10:00:00Z'),
        amount: 0,
        licenseKey: 'LIC-ADV-8492',
      },
    ];

    service.getUserLibrary().subscribe((library) => {
      expect(library).toEqual(expectedLibrary);
    });

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/v1/biblioteca`,
    );

    expect(request.request.method).toBe('GET');
    request.flush(apiResponse);
  });

  it('returns an empty library when the API returns no purchases', () => {
    service.getUserLibrary().subscribe((library) => {
      expect(library).toEqual([]);
    });

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/v1/biblioteca`,
    );

    expect(request.request.method).toBe('GET');
    request.flush({ userId: 'usr-demo-01', licenses: [], total: 0 });
  });
});