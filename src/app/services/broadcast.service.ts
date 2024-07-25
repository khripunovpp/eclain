import {EventEmitter, inject, Injectable, NgZone, Output} from "@angular/core";
import {CameraService} from "./camera.service";
import {ModelService} from "./model.service";
import {MovenetModelService, PointNameAsSting, PredictedCords} from "./movenet-model.service";
import _ from 'lodash';
import {PointCords, PointsService} from "./points.service";
import {MOBILE_WIDTH} from "../providers/responsive.provider";


@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  constructor() {
  }

  dotsRefs: Record<string, any> = {}
  @Output() readonly onPredict = new EventEmitter<PointCords>();
  private readonly mobile = inject(MOBILE_WIDTH)
  private readonly _ngZone = inject(NgZone);
  private readonly cameraService = inject(CameraService);
  readonly streamStarted = this.cameraService.streamStarted
  private readonly pointsService = inject(PointsService);
  private readonly modelService = inject(ModelService);
  private readonly movenetModelService = inject(MovenetModelService);
  private readonly pointWidth = 4;
  private readonly confidenceThreshold = 0.4;
  private readonly predictDelay = 100;
  private readonly predictWebcamThrottled = _.throttle(() => {
    this._ngZone.runOutsideAngular(() => {
      this.predictWebcam();
    });
  }, this.predictDelay);
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

  get cropPoints() {
    const [x, y] = this.movenetModelService.getCropPoint();
    return {x, y};
  }

  get windowCords() {
    return this.cropPoints;
  }

  get windowWidth() {
    return this.movenetModelService.cropWidth;
  }

  get faceSquare() {
    return this.faceWidth * this.faceHeight;
  }

  get faceWidth() {
    return this.movenetModelService.calculateFaceWidth(
        this.pointsService.dotsCords['leftEar'],
        this.pointsService.dotsCords['rightEar']
    )
  }

  get faceHeight() {
    return this.movenetModelService.calculateFaceHeight(
        this.pointsService.dotsCords['leftEar'],
        this.pointsService.dotsCords['rightEar']
    )
  }

  load(
      video: HTMLVideoElement
  ) {
    this.modelService.load();
  }

  async enable() {
    if (!this.modelService.model()) return;
    if (this.cameraService.supports) {
      await this._enableCam();
    } else {
      console.warn('getUserMedia() is not supported by your browser');
    }
  }

  putDot(
      cords: PredictedCords,
      key: PointNameAsSting
  ) {
    if (!this.getCords(key)) return;

    // может быть undefined, так как не все точки есть в cords, например, рта. модель не определяет рот
    const enoughConfidence = cords[key].confidence >= this.confidenceThreshold;

    if (enoughConfidence) {
      this.pointsService.putIfOk(key, this.calcAbsoluteCords(cords[key]));
    }

    this.updateDot(key);
  }


  getCords(
      key: PointNameAsSting
  ) {
    return this.pointsService.dotsCords[key];
  }

  calcAbsoluteCords(
      value: {
        x: number
        y: number
      },
  ): [number, number] {
    const [
      denormalizedX,
      denormalizedY
    ] = [
      this.movenetModelService.cropWidth * value.x,
      this.movenetModelService.cropWidth * value.y
    ]
    return [
      Math.ceil(denormalizedX - (this.pointWidth / 2)),
      Math.ceil(denormalizedY - (this.pointWidth / 2))
    ]
  }

  updateDot(
      key: PointNameAsSting
  ) {
    if (!this.dotsRefs[key]) return;
    this.dotsRefs[key].style.top = `${this.pointsService.dotsCords[key].y}px`;
    this.dotsRefs[key].style.left = `${this.pointsService.dotsCords[key].x}px`;
  }

  predictWebcam() {
    this.movenetModelService.calculate()
        .then(cords => this._update(cords))
        .then(() => {
          window.requestAnimationFrame(() => {
            this.predictWebcamThrottled();
          });
        })
        .catch((error: any) => {
          console.error(error);
        });
  }

  makePhotoByTimeout(
      timeout: number
  ) {
    setTimeout(() => {
      this.makePhoto();
    }, timeout)
  }

  makePhoto() {
    this.openPhotoInNewTab(this.cameraService.makePhoto() ?? '');
  }

  openPhotoInNewTab(
      dataUrl: string
  ) {
    const win = window.open();
    if (!win) return;
    win.document.write(`<img src="${dataUrl}"/>`);
  }

  private async _drawPoints(
      cords: PredictedCords,
  ) {
    Object.keys(this.pointsService.dotsCords).forEach((key) => {
      this.putDot(cords, key as PointNameAsSting);
    });
  }

  private _update(cords: any) {
    this._ngZone.runOutsideAngular(() => {
      this._drawPoints(cords)
          .then(() => this.onPredict.emit(this.pointsService.dotsCords));
    });
  }

  private async _enableCam() {
    await this.cameraService.enableCam()
    this.pointsService.initQueues();
    this.predictWebcamThrottled();
  }
}
