import {ElementRef, inject, Injectable} from "@angular/core";
import {CanvasRendererService} from "../../services/canvas-renderer.service";
import p5 from "p5";

@Injectable({
  providedIn: 'root'
})
export class CanvasLayoutService {
  constructor() {
  }

  private readonly canvasRendererService = inject(CanvasRendererService)

  init(
      canvasContainer: ElementRef,
      width: number,
      height: number,
  ) {
    this.canvasRendererService.init(canvasContainer, width, height);
  }

  onUpdate(callback: (p: p5) => void) {
    this.canvasRendererService.onDraw(callback);
  }

  onSetup(callback: (p: p5) => void) {
    this.canvasRendererService.onSetup(callback);
  }
}