import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { enableProdMode } from '@angular/core';

window.console.log = () => {};
window.console.warn = () => {};
enableProdMode();

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
