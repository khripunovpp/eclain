import {ElementRef, Injectable} from "@angular/core";
import type p5 from "p5";
import {keys} from "lodash";

export type CanvasRenderer = p5 | any

@Injectable({
  providedIn: 'root'
})
export class CanvasRendererService {
  private _p5?: CanvasRenderer;
  private _onDrawCallback?: (p: p5) => void;
  private _onSetupCallback?: (p: p5) => void;

  get renderer() {
    return this._p5;
  }

  init(
      canvasContainer: ElementRef,
      width: number,
      height: number,
  ) {
    new window.p5((p: CanvasRenderer) => {
      this._p5 = p;
      p.preload = () => {
      };

      p.setup = () => {
        p.createCanvas(width, height);

        this._onSetupCallback?.(p);
      };

      p.windowResized = () => {
        p.resizeCanvas(width, height);
      };

      p.draw = () => {
        this._onDrawCallback?.(p);
      };
    }, canvasContainer.nativeElement);
  }

  onDraw(callback: (p: p5) => void) {
    this._onDrawCallback = callback;
  }

  onSetup(callback: (p: p5) => void) {
    this._onSetupCallback = callback;
  }
}