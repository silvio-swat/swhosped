import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient } from '@angular/common/http'; // Importe o provideHttpClient
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importe FormsModule e ReactiveFormsModule
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api'; // Adição única necessária
import { SharedStandaloneModule } from './shared/shared-standalone.module';
import { APP_ROUTER_PROVIDERS } from './app.routes';
import { provideNgxMask } from 'ngx-mask';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    APP_ROUTER_PROVIDERS,
    provideHttpClient(), // Adicione o HttpClient
    importProvidersFrom(FormsModule, 
      ReactiveFormsModule, 
      MessageService, 
      SharedStandaloneModule
     ), // Adicione FormsModule e ReactiveFormsModule
    provideNgxMask()
  ],
};
