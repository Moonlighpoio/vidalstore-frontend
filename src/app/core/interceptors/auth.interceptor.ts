import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { fetchAuthSession } from 'aws-amplify/auth';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> => {
  const apiGatewayUrl = 'http://localhost:8080';
  
  console.log('[Interceptor] Petición a:', req.url);
  
  // Solo adjunta el token si la petición va al API Gateway
  if (!req.url.startsWith(apiGatewayUrl)) {
    console.log('[Interceptor] URL no whitelisteada, pasando sin token');
    return next(req);
  }

  return from(fetchAuthSession()).pipe(
    mergeMap((session) => {
      const accessToken = session.tokens?.accessToken.toString();

      if (accessToken) {
        console.log('[Interceptor] Token encontrado, adjuntando a la petición...');
        
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return next(authReq);
      } else {
        console.log('[Interceptor] No hay token, pasando sin Authorization header');
      }

      return next(req);
    })
  );
};