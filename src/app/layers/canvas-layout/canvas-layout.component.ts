import {AfterViewInit, Component, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {CanvasLayoutService} from "./canvas-layout.service";
import p5 from "p5";
import {Point} from "./point/point";
import {PointCords} from "../../services/points.service";

@Component({
  selector: 'app-canvas-layout',
  standalone: true,
  imports: [],
  templateUrl: './canvas-layout.component.html',
  styleUrl: './canvas-layout.component.scss'
})
export class CanvasLayoutComponent
    implements AfterViewInit {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;
  @Input({required: true}) width!: number
  @Input({required: true}) height!: number
  private readonly canvasLayoutService = inject(CanvasLayoutService)
  private points: Point[] = []

  ngAfterViewInit() {
    this.canvasLayoutService.init(this.canvasContainer, this.width, this.height);

    this.canvasLayoutService.onUpdate((p: p5) => {
      p.clear();
      for (let point of this.points) {
        point.show(p)
        point.update(p)
      }
    })
  }

  drawPointsByCords(
      cords: PointCords
  ) {
    this.points = []
    for (let [key, value] of Object.entries(cords)) {
      this.points.push(new Point(value.x, value.y, value.color))
    }
  }
}
