import {ElementRef, inject, Injectable} from "@angular/core";
import {CanvasRendererService} from "../../services/canvas-renderer.service";

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
}