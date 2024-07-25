import {inject, Injectable} from '@angular/core';
import {IS_MOBILE} from "../providers/responsive.provider";

@Injectable({
  providedIn: 'root'
})
export class VideoLayerService {

  constructor() {
  }

  private readonly mobile = inject(IS_MOBILE)
  private readonly maxWidth = 640;
  private readonly videoRatio = 640 / 480;
  private readonly videoRatioVertical = 480 / 640;

  get ration() {
    return this.mobile ? this.videoRatioVertical : this.videoRatio;
  }

  get videoWidth() {
    if (this.mobile) {
      return window.innerWidth;
    }
    const actualWidth = window.innerWidth;
    if (window.innerWidth > this.maxWidth) {
      return this.maxWidth
    } else {
      return actualWidth * this.ration;
    }
  };

  get videoHeight() {
    return this.videoWidth / this.ration;
  }
}
