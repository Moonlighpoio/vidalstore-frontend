import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { Game, GamePayload } from '../models/game.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private readonly catalogUrl = `${environment.apiUrl}/v1/catalogo`;

  constructor(private readonly http: HttpClient) {}

  getCatalog(): Observable<Game[]> {
    return this.http.get<Game[]>(this.catalogUrl);
  }

  getGameById(id: string): Observable<Game | undefined> {
    return this.getCatalog().pipe(
      map((games) => games.find((game) => game.id === id)),
    );
  }

  createGame(payload: GamePayload): Observable<Game> {
    return this.http.post<Game>(this.catalogUrl, payload);
  }

  updateGame(id: string, payload: GamePayload): Observable<Game> {
    return this.http.put<Game>(`${this.catalogUrl}/${id}`, payload);
  }
}