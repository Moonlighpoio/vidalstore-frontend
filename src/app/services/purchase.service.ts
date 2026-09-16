import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Purchase } from '../models/purchase.model';

export interface CreatePurchaseRequest {
  gameId: string;
  gameTitle: string;
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private readonly purchasesUrl = `${environment.apiUrl}/v1/compras`;

  constructor(private readonly http: HttpClient) {}

  createPurchase(gameId: string, gameTitle: string, amount: number): Observable<Purchase> {
    const request: CreatePurchaseRequest = {
      gameId,
      gameTitle,
      amount,
    };

    return this.http.post<Purchase>(this.purchasesUrl, request);
  }

  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.purchasesUrl);
  }
}
