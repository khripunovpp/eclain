import {ElementRef, Injectable} from "@angular/core";
import p5 from "p5";

@Injectable({
  providedIn: 'root'
})
export class CanvasRendererService {
  private _p5?: p5;
  private _onDrawCallback?: (p: p5) => void;
  private _onSetupCallback?: (p: p5) => void;

  get renderer() {
    if (!this._p5) {
      throw new Error('p5 is not initialized');
    }
    return this._p5;
  }

  init(
      canvasContainer: ElementRef,
      width: number,
      height: number,
  ) {
    new p5((p: p5) => {
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
    this._onDrawCallback = callback;
  }
}