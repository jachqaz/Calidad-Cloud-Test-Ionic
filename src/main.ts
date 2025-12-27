import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, RouteReuseStrategy} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {provideHttpClient} from '@angular/common/http';

import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {DATA_PROVIDERS} from './app/data/data.providers';
import {PRESENTATION_PROVIDERS} from './app/presentation/presentation.providers';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
    ...DATA_PROVIDERS,
    ...PRESENTATION_PROVIDERS
  ],
});
