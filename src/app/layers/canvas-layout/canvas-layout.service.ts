import {ElementRef, inject, Injectable} from "@angular/core";
import {CanvasRendererService} from "../../services/canvas-renderer.service";
import p5 from "p5";
import {PointCords} from "../../services/points.service";
import {Point} from "./objects/point";
import {Eclair} from "./objects/eclair";

@Injectable({
  providedIn: 'root'
})
export class CanvasLayoutService {
  constructor() {
  }

  points: Point[] = []
  eclairs: Eclair[] = []
  eclairsCount = 10;
  private readonly canvasRendererService = inject(CanvasRendererService)

  get renderer() {
    return this.canvasRendererService.renderer;
  }

  addPoints(
      cords: PointCords
  ) {
    this.points = []
    for (let [key, value] of Object.entries(cords)) {
      this.points.push(new Point(value.x, value.y, value.color))
    }
  }

  generateEclairs() {
    if (!this.renderer) return;
    for (let i = 0; i < this.eclairsCount; i++) {
      this.eclairs.push(new Eclair(this.renderer));
    }
  }

  init(
      canvasContainer: ElementRef,
      width: number,
      height: number,
  ) {
    this.canvasRendererService.init(canvasContainer, width, height);

    this.generateEclairs();
  }

  onUpdate(callback: (p: p5) => void) {
    this.canvasRendererService.onDraw(callback);
  }

  onSetup(callback: (p: p5) => void) {
    this.canvasRendererService.onSetup(callback);
  }
}