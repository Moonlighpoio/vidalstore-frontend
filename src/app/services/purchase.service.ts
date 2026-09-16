import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Purchase } from '../models/purchase.model';

@Injectable({
    providedIn: 'root',
})
export class PurchaseService {
    private readonly purchases: Purchase[] = [];

createPurchase(gameId: string, gameTitle: string, amount: number): Observable<Purchase> {
    const licenseCode = 'LIC-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const newRecord: Purchase = {
    id: 'ord-' + Date.now(),
    gameId,
    gameTitle,
    userId: 'usr-demo-01',
    timestamp: new Date(),
    amount,
    licenseKey: licenseCode,
    };

    this.purchases.push(newRecord);
    return of(newRecord);
}

    getPurchases(): Observable<Purchase[]> {
    return of(this.purchases);
    }
}