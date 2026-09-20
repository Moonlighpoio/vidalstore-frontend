import { CanActivateFn, Router } from '@angular/router';
import { fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);

  try {
    console.log('[AuthGuard] Verificando sesión...');
    
    const session = await fetchAuthSession();
    
    if (session.tokens) {
      console.log('[AuthGuard] Usuario autenticado, permitiendo acceso...');
      return true;  // Usuario autenticado
    } else {
      console.log('[AuthGuard] No hay sesión, redirigiendo a Cognito...');
      // No hay sesión, redirige a Cognito
      await signInWithRedirect();
      return false;
    }
  } catch (error) {
    console.error('[AuthGuard] Error en auth guard:', error);
    await signInWithRedirect();
    return false;
  }
};