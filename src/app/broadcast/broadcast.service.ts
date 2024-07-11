import {computed, inject, Injectable, NgZone, signal} from "@angular/core";
import {CameraService} from "../services/camera.service";
import {ModelService} from "../services/model.service";
import {MovenetModelService} from "../services/movenet-model.service";
import _ from 'lodash';
import {PredictService} from "../services/predict.service";


@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  constructor() {
  }

  dotsRefs: Record<string, any> = {}
  private readonly _ngZone = inject(NgZone);
  private readonly cameraService = inject(CameraService);
  readonly streamStarted = this.cameraService.streamStarted
  readonly supports = this.cameraService.supports
  private readonly predictService = inject(PredictService);
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
        this.predictService.dotsCords['leftEar'],
        this.predictService.dotsCords['rightEar']
    )
  }

  get faceHeight() {
    return this.movenetModelService.calculateFaceHeight(
        this.predictService.dotsCords['leftEar'],
        this.predictService.dotsCords['rightEar']
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
      cords: Record<string, { x: number; y: number; confidence: number }>,
      key: string
  ) {
    if (!this.getCords(key)) return;
    const enoughConfidence = cords[key].confidence >= this.confidenceThreshold;

    if (enoughConfidence) {
      this.predictService.putIfOk(key, this.calcAbsoluteCords(cords[key]));
    }

    this.updateDot(key);
  }


  getCords(
      key: string
  ) {
    return this.predictService.dotsCords[key];
  }

  calcAbsoluteCords(
      value: {
        x: number
        y: number
      },
  ): [number, number] {
    const {x, y} = this.cropPoints;
    return [
      Math.ceil((value.x * this.movenetModelService.cropWidth) + x - (this.pointWidth / 2)),
      Math.ceil((value.y * this.movenetModelService.cropWidth) + y - (this.pointWidth / 2))
    ]
  }

  updateDot(
      key: string
  ) {
    if (!this.dotsRefs[key]) return;
    this.dotsRefs[key].style.top = `${this.predictService.dotsCords[key].y}px`;
    this.dotsRefs[key].style.left = `${this.predictService.dotsCords[key].x}px`;
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

  private async _drawPoints(cords: any) {
    Object.keys(this.predictService.dotsCords).forEach((key) => {
      this.putDot(cords, key);
    });
  }

  private async _update(cords: any) {
    await this._drawPoints(cords)
  }

  private _enableCam() {
    this.cameraService.enableCam().then(() => {
      this.predictService.initQueues();
      this.predictWebcamThrottled();
    })
  }
}
