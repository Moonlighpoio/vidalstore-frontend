import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MOCK_USER_LICENSES } from '../mocks/library.mock';
import { Purchase } from '../models/purchase.model';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  getUserLibrary(): Observable<Purchase[]> {
    return of(MOCK_USER_LICENSES);
  }
}