import {ElementRef, inject, Injectable} from "@angular/core";
import {CanvasRenderer, CanvasRendererService} from "../../services/canvas-renderer.service";
import {GameService} from "../../services/game.service";
import {FaceService} from "../../services/face.service";

@Injectable({
  providedIn: 'root'
})
export class CanvasLayoutService {
  constructor() {
  }

  public readonly gameService = inject(GameService)
  public readonly faceService = inject(FaceService)
  private readonly canvasRendererService = inject(CanvasRendererService)

  init(
      canvasContainer: ElementRef,
      width: number,
      height: number,
  ) {
    this.canvasRendererService.init(canvasContainer, width, height);
    this.gameService.init()?.then(() => {

      this.canvasRendererService.onDraw((p: CanvasRenderer) => {
        this.gameService.update();
        this.faceService.show();
        this.faceService.update();
      });
    });

  }
}