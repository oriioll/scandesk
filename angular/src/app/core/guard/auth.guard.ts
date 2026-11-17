import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AccessTokenService } from '../../services/access_token.service';

/**
 * Guard to check if user is logged or not, if isn't logged go back to login
 * Redirect unauthenticated users to login; otherwise allow the route.
 * @param route - Route being activated
 * @param state - Target router state
 * @returns Observable<boolean | UrlTree> - Emits true for authenticated users or a login redirect
 * @author Oriol Plazas
 * @since 1.0.0
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const accessTokenService = inject(AccessTokenService);
  return accessTokenService.getToken() ? true : router.createUrlTree(['/login']);
};
