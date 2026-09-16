import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { authInterceptor } from './auth.interceptor';

vi.mock('aws-amplify/auth', () => ({
  fetchAuthSession: vi.fn().mockResolvedValue({
    tokens: undefined,
  }),
}));

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.restoreAllMocks();
    sessionStorage.clear();
    TestBed.resetTestingModule();
  });

  it('propagates a 401 error and redirects to login', async () => {
    const requestPromise = new Promise<void>((resolve, reject) => {
      http.get('http://localhost:8080/v1/catalogo').subscribe({
        next: () => reject(new Error('Expected the request to fail')),
        error: () => {
          try {
            expect(router.navigate).toHaveBeenCalledWith(['/login'], {
              queryParams: {
                sessionExpired: 'true',
              },
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        },
      });
    });

    await Promise.resolve();

    const request = httpTestingController.expectOne(
      'http://localhost:8080/v1/catalogo',
    );

    request.flush(
      { message: 'Unauthorized' },
      {
        status: 401,
        statusText: 'Unauthorized',
      },
    );

    await requestPromise;
  });

  it('propagates a 403 error and redirects to forbidden', async () => {
    const requestPromise = new Promise<void>((resolve, reject) => {
      http.get('http://localhost:8080/v1/catalogo').subscribe({
        next: () => reject(new Error('Expected the request to fail')),
        error: () => {
          try {
            expect(router.navigate).toHaveBeenCalledWith(['/forbidden']);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
      });
    });

    await Promise.resolve();

    const request = httpTestingController.expectOne(
      'http://localhost:8080/v1/catalogo',
    );

    request.flush(
      { message: 'Forbidden' },
      {
        status: 403,
        statusText: 'Forbidden',
      },
    );

    await requestPromise;
  });

  it('does not add Authorization to requests outside the API Gateway', () => {
    http.get('/assets/config.json').subscribe();

    const request = httpTestingController.expectOne('/assets/config.json');

    expect(request.request.headers.has('Authorization')).toBe(false);

    request.flush({});
  });

  it('continues a Gateway request without Authorization when there is no session', async () => {
    const requestPromise = new Promise<void>((resolve) => {
      http.get('http://localhost:8080/v1/catalogo').subscribe(() => {
        resolve();
      });
    });

    await Promise.resolve();

    const request = httpTestingController.expectOne(
      'http://localhost:8080/v1/catalogo',
    );

    expect(request.request.headers.has('Authorization')).toBe(false);

    request.flush([]);

    await requestPromise;
  });
});