import {ElementRef, inject, Injectable} from "@angular/core";
import {CanvasRendererService} from "../../services/canvas-renderer.service";
import p5 from "p5";
import {PointCords} from "../../services/points.service";
import {Point} from "./objects/point";
import {Eclair} from "./objects/eclair";
import {Mouth} from "./objects/mouth";

@Injectable({
  providedIn: 'root'
})
export class CanvasLayoutService {
  constructor() {
  }

  points: Point[] = []
  eclairs: Eclair[] = []
  eclairsCount = 10;
  private mouth?: Mouth;
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

  addMouth(
      cords: PointCords,
  ) {
    if (!this.renderer) return;
    this.mouth = Mouth.factory(this.renderer, cords);
  }

  init(
      canvasContainer: ElementRef,
      width: number,
      height: number,
  ) {
    this.canvasRendererService.init(canvasContainer, width, height);

    this.canvasRendererService.onDraw((p: p5) => {
      p.clear();

      let currentTime = p.frameCount / 60;

      for (let eclair of this.eclairs) {
        eclair.update(currentTime);
        eclair.display();
      }

      for (let point of this.points) {
        point.show(p)
        point.update(p)
      }

      if (this.mouth) {
        this.mouth.show();
      }
    });

    this.generateEclairs();
  }

}