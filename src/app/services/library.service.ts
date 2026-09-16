import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Purchase } from '../models/purchase.model';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private readonly libraryUrl = `${environment.apiUrl}/v1/biblioteca`;

  constructor(private readonly http: HttpClient) {}

  getUserLibrary(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.libraryUrl);
  }
}
