import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { Purchase } from '../models/purchase.model';

interface LibraryApiLicense {
  id: string;
  userId: string;
  gameId: string;
  gameTitle?: string;
  purchasedAt: string;
  revoked: boolean;
}

interface LibraryApiResponse {
  userId: string;
  licenses: LibraryApiLicense[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private readonly libraryUrl = `${environment.apiUrl}/v1/biblioteca`;

  constructor(private readonly http: HttpClient) {}

  getUserLibrary(): Observable<Purchase[]> {
    return this.http.get<LibraryApiResponse>(this.libraryUrl).pipe(
      map((response) =>
        (response?.licenses ?? []).map((license) => ({
          id: license.id,
          gameId: license.gameId,
          gameTitle: license.gameTitle ?? `Juego ${license.gameId}`,
          userId: license.userId,
          timestamp: new Date(license.purchasedAt),
          amount: 0,
          licenseKey: license.id,
        })),
      ),
    );
  }
}