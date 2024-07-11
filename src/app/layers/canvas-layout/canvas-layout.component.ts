import {AfterViewInit, Component, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {CanvasLayoutService} from "./canvas-layout.service";
import p5 from "p5";
import {Point} from "./point/point";

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
  @Input() width: number = 400
  @Input() height: number = 400
  private readonly canvasLayoutService = inject(CanvasLayoutService)
  private readonly points: Point[] = []

  ngAfterViewInit() {
    this.canvasLayoutService.init(this.canvasContainer, this.width, this.height);
    this.points.push(new Point(30, 30))

    this.canvasLayoutService.onUpdate((p: p5) => {

      for (let point of this.points) {
        point.show(p)
        point.update(p)
      }
    })
  }
}
