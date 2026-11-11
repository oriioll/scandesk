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
 * Guard to check if user is logged or not, if isn't logged go back to login
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService
    .userIsLogged()
    .pipe(map((logged) => (logged ? true : router.createUrlTree(['/login']))));
};
