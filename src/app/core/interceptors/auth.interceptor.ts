import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, catchError, switchMap, throwError } from 'rxjs';
import { fetchAuthSession } from 'aws-amplify/auth';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const gatewayUrl = environment.apiUrl.replace(/\/+$/, '');

  // Whitelist: solo solicitudes que inicien con la URL base del Gateway
  const isGatewayRequest = req.url.startsWith(gatewayUrl);

  if (!isGatewayRequest) {
    return next(req);
  }

  return from(fetchAuthSession()).pipe(
    switchMap(session => {
      const accessToken = session.tokens?.accessToken?.toString();

      // Si no hay sesión o token, la solicitud continúa sin header
      if (!accessToken) {
        return next(req);
      }

      // Clona la solicitud agregando el Bearer token únicamente al gateway
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      return next(authReq);
    }),
    catchError((error: HttpErrorResponse) => {
      // Manejo de token expirado o no autorizado por el backend/gateway
      if (error.status === 401) {
        sessionStorage.clear();
        router.navigate(['/login'], { queryParams: { sessionExpired: 'true' } });
      }
      return throwError(() => error);
    })
  );
};