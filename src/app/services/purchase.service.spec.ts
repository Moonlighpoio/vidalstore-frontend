import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { environment } from '../../environments/environment';
import { Purchase } from '../models/purchase.model';
import { PurchaseService } from './purchase.service';

describe('PurchaseService', () => {
  let service: PurchaseService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurchaseService, provideHttpClientTesting()],
    });

    service = TestBed.inject(PurchaseService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('initializes the purchase service', () => {
    expect(service).toBeTruthy();
  });

  it('creates a purchase through the API Gateway', () => {
    const expectedPurchase: Purchase = {
      id: 'ord-101',
      gameId: '1',
      gameTitle: 'Super Adventure',
      userId: 'usr-demo-01',
      timestamp: new Date('2026-09-16T16:00:00Z'),
      amount: 29.99,
      licenseKey: 'LIC-ADV-8492',
    };

    service
      .createPurchase('1', 'Super Adventure', 29.99)
      .subscribe((purchase) => {
        expect(purchase).toEqual(expectedPurchase);
      });

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/v1/compras`,
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      gameId: '1',
      gameTitle: 'Super Adventure',
      amount: 29.99,
    });

    request.flush(expectedPurchase);
  });

  it('gets purchases through the API Gateway', () => {
    const expectedPurchases: Purchase[] = [
      {
        id: 'ord-101',
        gameId: '1',
        gameTitle: 'Super Adventure',
        userId: 'usr-demo-01',
        timestamp: new Date('2026-09-16T16:00:00Z'),
        amount: 29.99,
        licenseKey: 'LIC-ADV-8492',
      },
    ];

    service.getPurchases().subscribe((purchases) => {
      expect(purchases).toEqual(expectedPurchases);
    });

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/v1/compras`,
    );

    expect(request.request.method).toBe('GET');
    request.flush(expectedPurchases);
  });

  it('sends the selected game data in the purchase request', () => {
    service.createPurchase('3', 'Puzzle Master', 14.99).subscribe();

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/v1/compras`,
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      gameId: '3',
      gameTitle: 'Puzzle Master',
      amount: 14.99,
    });

    request.flush({
      id: 'ord-102',
      gameId: '3',
      gameTitle: 'Puzzle Master',
      userId: 'usr-demo-01',
      timestamp: new Date('2026-09-16T16:05:00Z'),
      amount: 14.99,
      licenseKey: 'LIC-PUZ-1204',
    });
  });
});