import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MOCK_GAMES } from '../mocks/catalog.mock';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  getCatalog(): Observable<Game[]> {
    return of(MOCK_GAMES);
  }

  getGameById(id: string): Observable<Game | undefined> {
    return of(MOCK_GAMES.find((game) => game.id === id));
  }
}
