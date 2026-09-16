import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { fetchAuthSession } from 'aws-amplify/auth';
import {
  catchError,
  from,
  switchMap,
  throwError,
} from 'rxjs';

import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const gatewayUrl = environment.apiUrl.replace(/\/+$/, '');

  const isGatewayRequest = req.url.startsWith(gatewayUrl);

  if (!isGatewayRequest) {
    return next(req);
  }

  return from(fetchAuthSession()).pipe(
    switchMap((session) => {
      const accessToken = session.tokens?.accessToken?.toString();

      if (!accessToken) {
        return next(req);
      }

      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return next(authReq);
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        sessionStorage.clear();

        void router.navigate(['/login'], {
          queryParams: {
            sessionExpired: 'true',
          },
        });
      }

      if (error.status === 403) {
        void router.navigate(['/forbidden']);
      }

      return throwError(() => error);
    }),
  );
};