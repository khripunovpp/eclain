import {inject, Injectable} from "@angular/core";
import {Eclair} from "../layers/canvas-layout/objects/eclair";
import {CanvasRendererService} from "./canvas-renderer.service";

@Injectable({
  providedIn: 'root'
})
export class EclairsService {
  constructor() {
  }

  eclairs: Eclair[] = []
  eclairsCount = 5;
  private readonly cr = inject(CanvasRendererService);
  private _img: any;
  private _lastEclair?: Eclair;

  async createEclairs() {
    try {
      this._img = await this._loadPic();
      for (let i = 0; i < this.eclairsCount; i++) {
        this._lastEclair = new Eclair(this.cr.renderer, i, this._getPositionByLastEclair(this._lastEclair));
        this._lastEclair.setImage(this._img);
        this.eclairs.push(this._lastEclair);
      }
    } catch (e) {
      console.error('Error loading image', e);
    }
  }

  resetEclair(eclair: Eclair) {
    eclair.pos.set(this._getPositionByLastEclair(this._lastEclair));
    this._lastEclair = eclair;
  }

  hitEclair(eclair: Eclair) {
    this.resetEclair(eclair);
  }

  private _getPositionByLastEclair(lastEclair?: Eclair) {
    if (!lastEclair?.pos) {
      return this.cr.renderer.createVector(
          this.cr.renderer.random(this.cr.renderer.width),
          -this.cr.renderer.random(0, 200),
      );
    }
    return this.cr.renderer.createVector(
        this.cr.renderer.random(this.cr.renderer.width),
        -this.cr.renderer.random(Math.abs(lastEclair.pos.y) + 50, Math.abs(lastEclair.pos.y) + 300),
    );
  }

  private _loadPic() {
    return new Promise((resolve, reject) => this.cr.renderer.loadImage('./eclair.png', resolve, reject));
  }
}
