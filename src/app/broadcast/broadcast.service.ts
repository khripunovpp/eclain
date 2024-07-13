import {computed, EventEmitter, inject, Injectable, NgZone, Output} from "@angular/core";
import {CameraService} from "../services/camera.service";
import {ModelService} from "../services/model.service";
import {MovenetModelService, PointNameAsSting, PredictedCords} from "../services/movenet-model.service";
import _ from 'lodash';
import {PointCords, PointsService} from "../services/points.service";


@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  constructor() {
  }

  dotsRefs: Record<string, any> = {}
  @Output() readonly onPredict = new EventEmitter<PointCords>();
  private readonly _ngZone = inject(NgZone);
  private readonly cameraService = inject(CameraService);
  readonly streamStarted = this.cameraService.streamStarted
  readonly supports = this.cameraService.supports
  private readonly pointsService = inject(PointsService);
  private readonly modelService = inject(ModelService);
  readonly canEnableCam = computed(() => {
    return this.cameraService.supports() && this.modelService.model();
  });
  readonly modelReady = this.modelService.model
  private readonly movenetModelService = inject(MovenetModelService);
  private readonly pointWidth = 4;
  private readonly confidenceThreshold = 0.4;
  private readonly predictDelay = 100;
  private readonly predictWebcamThrottled = _.throttle(() => {
    this._ngZone.runOutsideAngular(() => {
      this.predictWebcam();
    });
  }, this.predictDelay);

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
    this.modelService.load().then(() => {
      this.cameraService.bind(video);
    });
  }

  enable() {
    if (!this.modelService.model()) return;
    if (this.cameraService.supports()) {
      this._enableCam();
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

  private async _update(cords: any) {
    await this._drawPoints(cords)
    this.onPredict.emit(this.pointsService.dotsCords);
  }

  private _enableCam() {
    this.cameraService.enableCam().then(() => {
      this.pointsService.initQueues();
      this.predictWebcamThrottled();
    })
  }
}
