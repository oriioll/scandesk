import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';
/**
 * Guard to check if user isn't logged, if is, go back login
 * Redirect authenticated users to the dashboard; otherwise allow the route.
 * @param route - Route being activated
 * @param state - Target router state
 * @returns Observable<boolean | UrlTree> - Emits true for guests or a dashboard redirect
 * @author Oriol Plazas
 * @since 1.0.0
 */
export const guestGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService
    .userIsLogged()
    .pipe(map((logged) => (logged ? router.createUrlTree(['/dashboard']) : true)));
};
