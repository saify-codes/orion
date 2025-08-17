import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin/auth-service.service';

export const authGuardGuard: CanActivateFn = (route, state) => {

  const auth   = inject(AdminAuthService)
  const router = inject(Router);
  
  if (auth.isAuthenticated()) {
    return true
  }
  
  router.navigate(['/admin/auth/login'])

  return false;
};
