import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MOCK_PURCHASES } from '../mocks/purchase.mock';
import { Purchase } from '../models/purchase.model';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  createPurchase(
    gameId: string,
    gameTitle: string,
    amount: number,
  ): Observable<Purchase> {
    const licenseCode =
      `LIC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const newRecord: Purchase = {
      id: `ord-${Date.now()}`,
      gameId,
      gameTitle,
      userId: 'usr-demo-01',
      timestamp: new Date(),
      amount,
      licenseKey: licenseCode,
    };

    MOCK_PURCHASES.push(newRecord);

    return of(newRecord);
  }

  getPurchases(): Observable<Purchase[]> {
    return of(MOCK_PURCHASES);
  }
}