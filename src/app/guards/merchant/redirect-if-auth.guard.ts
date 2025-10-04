import { CanActivateFn, Router } from '@angular/router';
import { MerchantAuthService } from '../../services/merchant/auth.service';
import { inject } from '@angular/core';

export const redirectIfAuthGuard: CanActivateFn = (route, state) => {
  
  const auth   = inject(MerchantAuthService);
  const router = inject(Router);
  
  if (auth.isAuthenticated()) {
    router.navigateByUrl('/');
  }

  return true;
};
