import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration,  withEventReplay} from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AdminAuthService } from './services/admin/auth-service.service';
import { MerchantAuthService } from './services/merchant/auth.service';
import { BaseUrlInterceptor } from './interceptors/base-url.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([BaseUrlInterceptor])),
    provideAppInitializer( () => inject(AdminAuthService).init()),
    provideAppInitializer( () => inject(MerchantAuthService).init()),
    
  ],
};
