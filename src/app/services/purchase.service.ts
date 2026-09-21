import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreatePurchaseRequest {
  gameId: string;
  gameTitle?: string;
  amount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private readonly http = inject(HttpClient);
  private readonly purchasesUrl = `${environment.apiUrl}/v1/compras`;

  // Método directo enviando gameId (lo que espera el backend)
  purchaseGame(gameId: string): Observable<any> {
    return this.http.post(this.purchasesUrl, { gameId });
  }

  // Método extendido con título y monto
  createPurchase(gameId: string, gameTitle?: string, amount?: number): Observable<any> {
    return this.http.post(this.purchasesUrl, {
      gameId,
      gameTitle: gameTitle || 'Juego',
      amount: amount ?? 0,
    });
  }

  getPurchases(): Observable<any[]> {
    return this.http.get<any[]>(this.purchasesUrl);
  }
}