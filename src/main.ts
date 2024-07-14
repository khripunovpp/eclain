import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/config/app.config';
import {AppComponent} from './app/app.component';
import type p5 from 'p5';

declare global {
  interface Window {
    p5: typeof p5;
  }
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
