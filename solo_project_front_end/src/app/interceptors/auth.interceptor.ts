import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  // 如果是登入或註冊請求，直接放行
  if (req.url.includes('/api/login') || req.url.includes('/api/users/register')) {
    return next(req);
  }

  return authService.currentUser$.pipe(
    take(1), // 只取 currentUser$ 的第一個值，避免無限循環或記憶體洩漏
    switchMap(user => {
      console.log('[Interceptor] Intercepting request for:', req.url);
      console.log('[Interceptor] Current user state from currentUser$:', user);
      if (user && user.token) {
        console.log('[Interceptor] Token found. Adding Authorization header.');
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`
          }
        });
        return next(authReq);
      }
      console.log('[Interceptor] No user or token found. Sending original request.');
      // 如果沒有 user 或 token，直接送出原始請求
      return next(req);
    })
  );
};
