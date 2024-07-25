import {InjectionToken} from "@angular/core";

export const MOBILE_WIDTH = new InjectionToken('mobile', {
  factory: () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any)['opera'];
    const isMobile = /android|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(userAgent);
    const screenWidth = window.innerWidth;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return isMobile && screenWidth <= 768 && hasTouch;
  }
})