import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

export const ngrokInterceptor: HttpInterceptorFn = (req, next) =>
  environment.production
    ? next(req)
    : next(req.clone({ setHeaders: { 'ngrok-skip-browser-warning': 'true' } }));
