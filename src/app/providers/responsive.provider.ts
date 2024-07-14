import {InjectionToken} from "@angular/core";

export const MOBILE_WIDTH = new InjectionToken('mobile', {
  factory: () => {
    return window.innerWidth < 768;
  }
})