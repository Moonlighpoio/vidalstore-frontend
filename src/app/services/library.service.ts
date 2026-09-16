import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Purchase } from '../models/purchase.model';

@Injectable({
    providedIn: 'root',
})
export class LibraryService {
    private readonly userLicenses: Purchase[] = [
    {
    id: 'ord-101',
    gameId: '1',
    gameTitle: 'Super Adventure',
    userId: 'usr-demo-01',
    timestamp: new Date('2026-09-01T10:00:00Z'),
    amount: 29.99,
    licenseKey: 'LIC-ADV-8492',
    },
    {
    id: 'ord-102',
    gameId: '3',
    gameTitle: 'Puzzle Master',
    userId: 'usr-demo-01',
    timestamp: new Date('2026-09-08T15:30:00Z'),
    amount: 14.99,
    licenseKey: 'LIC-PUZ-1204',
    },
];

    getUserLibrary(): Observable<Purchase[]> {
    return of(this.userLicenses);
    }
}