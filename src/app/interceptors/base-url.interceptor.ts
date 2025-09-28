// src/app/interceptors/base-url.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const BaseUrlInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const apiReq = req.clone({
    url: `${environment.baseURL}/${req.url}`,
  });
  return next(apiReq);
};
