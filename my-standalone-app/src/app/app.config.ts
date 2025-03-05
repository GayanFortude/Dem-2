import {
  ApplicationConfig,
  provideZoneChangeDetection,
  inject,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { environment } from './environment';

export function disableConsole() {
  return () => {
      window.console.log = () => {};
      window.console.warn = () => {};
      window.console.error = () => {};

  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({
          uri: environment.graphql2,
        }),
        cache: new InMemoryCache(),
      };
    }),
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: disableConsole,
    //   multi: true
    // }
  ],
};
