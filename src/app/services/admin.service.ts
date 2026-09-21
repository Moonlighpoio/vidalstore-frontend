import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly licenciasUrl = `${environment.apiUrl}/v1/licencias`;
  private readonly auditoriaUrl = `${environment.apiUrl}/v1/auditoria`;

  constructor(private readonly http: HttpClient) {}

  getLicenses(): Observable<any[]> {
    return this.http.get<any[]>(this.licenciasUrl);
  }

  revokeLicense(id: string): Observable<any> {
    return this.http.delete<any>(`${this.licenciasUrl}/${id}`);
  }

  getAudit(): Observable<any[]> {
    return this.http.get<any[]>(this.auditoriaUrl);
  }
}