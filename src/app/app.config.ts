import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration,  withEventReplay} from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AdminAuthService } from './services/admin/auth-service.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideAppInitializer( () => inject(AdminAuthService).init())
  ],
};
