import {inject, Injectable} from "@angular/core";
import {PointsService} from "./points.service";
import {CanvasRendererService} from "./canvas-renderer.service";
import {Mouth} from "../objects/mouth";
import {IndicatorsService} from "./indicators.service";

@Injectable({
  providedIn: 'root'
})
export class FaceService {
  constructor() {
  }

  mouth?: Mouth;
  private readonly pointsService = inject(PointsService);
  private readonly cr = inject(CanvasRendererService);
  private readonly indicatorsService = inject(IndicatorsService)

  get faceCenter() {
    return {
      x: this.pointsService.dotsCords['leftEye'].x + (this.pointsService.dotsCords['rightEye'].x - this.pointsService.dotsCords['leftEye'].x) / 2,
      y: this.pointsService.dotsCords['leftEye'].y + (this.pointsService.dotsCords['rightEye'].y - this.pointsService.dotsCords['leftEye'].y) / 2,
    }
  }

  get faceVerticalTilt() {
    return this.pointsService.dotsCords['leftEye'].y - this.pointsService.dotsCords['rightEye'].y;
  }

  update() {
    this.mouth = new Mouth(this.cr.renderer, this.pointsService.dotsCords);
    if (this.indicatorsService.hidden) return
    this.mouth.show();
    this.cr.renderer.ellipse(
        this.faceCenter.x,
        this.faceCenter.y,
        10,
        10,
    );
  }
}
