import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  // 使用 inject 來獲取服務實例
  const authService = inject(AuthService);
  const router = inject(Router);

  // 呼叫 AuthService 中的 isAuthenticated 方法
  if (authService.isAuthenticated()) {
    return true; // 如果已登入，允許訪問
  } else {
    // 如果未登入，建立一個 URL 樹並導向到登入頁
    return router.createUrlTree(['/login']);
  }
};
