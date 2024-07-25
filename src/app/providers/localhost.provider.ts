import {InjectionToken} from "@angular/core";

export const IS_LOCALHOST = new InjectionToken<boolean>('IS_LOCALHOST', {
  factory: () => {
    return window.location.hostname === 'localhost';
  }
})