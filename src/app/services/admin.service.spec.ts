import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { environment } from '../../environments/environment';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminService, provideHttpClientTesting()],
    });

    service = TestBed.inject(AdminService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('initializes the admin service', () => {
    expect(service).toBeTruthy();
  });

  it('requests all licenses from the API Gateway', () => {
    const licenses = [
      {
        id: 'lic-1',
        userId: 'user-1',
        gameId: 'game-1',
        purchasedAt: '2026-01-01T00:00:00.000Z',
        revoked: false,
      },
    ];

    service.getLicenses().subscribe((result) => {
      expect(result).toEqual(licenses);
    });

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/v1/licencias`,
    );

    expect(request.request.method).toBe('GET');
    request.flush(licenses);
  });

  it('revokes a license via DELETE to the API Gateway', () => {
    const revoked = { id: 'lic-1', revoked: true };

    service.revokeLicense('lic-1').subscribe((result) => {
      expect(result).toEqual(revoked);
    });

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/v1/licencias/lic-1`,
    );

    expect(request.request.method).toBe('DELETE');
    request.flush(revoked);
  });

  it('requests the revocation audit from the API Gateway', () => {
    const audit = [
      {
        id: 'aud-1',
        licenseId: 'lic-1',
        revokedBy: 'admin-1',
        userId: 'user-1',
        gameId: 'game-1',
        revokedAt: '2026-01-02T00:00:00.000Z',
      },
    ];

    service.getAudit().subscribe((result) => {
      expect(result).toEqual(audit);
    });

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/v1/auditoria`,
    );

    expect(request.request.method).toBe('GET');
    request.flush(audit);
  });
});