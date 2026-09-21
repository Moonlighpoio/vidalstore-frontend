import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Observable, from, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const apiGatewayUrl = environment.apiUrl;

  if (!req.url.startsWith(apiGatewayUrl)) {
    return next(req);
  }

  return from(fetchAuthSession()).pipe(
    mergeMap((session) => {
      const accessToken = session.tokens?.accessToken.toString();
      const authReq = accessToken
        ? req.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        : req;

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            router.navigate(['/login'], {
              queryParams: { sessionExpired: 'true' },
            });
          } else if (error.status === 403) {
            router.navigate(['/forbidden']);
          }

          return throwError(() => error);
        }),
      );
    }),
  );
};