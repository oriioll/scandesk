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
