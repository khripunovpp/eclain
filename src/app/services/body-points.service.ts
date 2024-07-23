import {inject, Injectable} from '@angular/core';
import {Point} from "../objects/point";
import {PointCords} from "./points.service";
import {CanvasRendererService} from "./canvas-renderer.service";
import {IndicatorsService} from "./indicators.service";

@Injectable({
  providedIn: 'root'
})
export class BodyPointsService {

  constructor() {
  }

  points: Point[] = []
  private readonly cr = inject(CanvasRendererService)
  private readonly indicatorsService = inject(IndicatorsService)


  createPoints(
      cords: PointCords
  ) {
    this.points = []
    for (let [key, value] of Object.entries(cords)) {
      this.points.push(new Point(value.x, value.y, value.color))
    }
  }

  update() {
    if (this.indicatorsService.hidden) return
    for (let point of this.points) {
      point.show(this.cr.renderer)
      point.update(this.cr.renderer)
    }
  }
}
