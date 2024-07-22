import {inject, Injectable} from "@angular/core";
import {PointsService} from "./points.service";
import {CanvasRendererService} from "./canvas-renderer.service";
import {Mouth} from "../layers/canvas-layout/objects/mouth";

@Injectable({
  providedIn: 'root'
})
export class FaceService {
  constructor() {
  }

  mouth?: Mouth;
  private readonly pointsService = inject(PointsService);
  private readonly cr = inject(CanvasRendererService);

  get faceCenter() {
    return {
      x: this.pointsService.dotsCords['leftEye'].x + (this.pointsService.dotsCords['rightEye'].x - this.pointsService.dotsCords['leftEye'].x) / 2,
      y: this.pointsService.dotsCords['leftEye'].y + (this.pointsService.dotsCords['rightEye'].y - this.pointsService.dotsCords['leftEye'].y) / 2,
    }
  }

  get faceVerticalTilt() {
    return this.pointsService.dotsCords['leftEye'].y - this.pointsService.dotsCords['rightEye'].y;
  }

  createMouth() {
    return new Mouth(this.cr.renderer, this.pointsService.dotsCords);
  }

  update() {
    this.cr.renderer.ellipse(
        this.faceCenter.x,
        this.faceCenter.y,
        10,
        10,
    );
  }

  show() {
    this.mouth = this.createMouth();
  }

}
