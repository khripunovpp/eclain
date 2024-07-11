import {AfterViewInit, Component, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {CanvasLayoutService} from "./canvas-layout.service";

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

  ngAfterViewInit() {
    this.canvasLayoutService.init(this.canvasContainer, this.width, this.height);
  }
}
