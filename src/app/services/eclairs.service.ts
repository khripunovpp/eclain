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
  eclairsCount = 3;
  private readonly cr = inject(CanvasRendererService);
  private _img: any;

  async createEclairs() {
    try {
      this._img = await this._loadPic();
      for (let i = 0; i < this.eclairsCount; i++) {
        const eclair = new Eclair(this.cr.renderer, i);
        eclair.setImage(this._img);
        this.eclairs.push(eclair);
      }
    } catch (e) {
      console.error('Error loading image', e);
    }
  }

  private _loadPic() {
    return new Promise((resolve, reject) => this.cr.renderer.loadImage('./eclair.png', resolve, reject));
  }
}
