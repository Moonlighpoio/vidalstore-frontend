import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanActivateFn = async (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data?.['roles'] || [];
  const userGroups = await authService.getUserGroups();

  // Si no se especificaron roles requeridos, se permite el acceso
  if (expectedRoles.length === 0) {
    return true;
  }

  // Comprueba si el usuario pertenece a al menos uno de los grupos autorizados
  const hasRequiredRole = expectedRoles.some(role => userGroups.includes(role));

  if (hasRequiredRole) {
    return true;
  }

  // Si el usuario está autenticado pero no tiene el grupo necesario
  return router.createUrlTree(['/forbidden']);
};