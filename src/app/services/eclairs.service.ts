import {computed, inject, Injectable, signal} from "@angular/core";
import {Eclair} from "../objects/eclair";
import {CanvasRendererService} from "./canvas-renderer.service";

@Injectable({
  providedIn: 'root'
})
export class EclairsService {
  constructor() {
  }

  eclairs: Eclair[] = []
  eclairsCount = 5;
  eclairsShowed = signal(0);
  private readonly cr = inject(CanvasRendererService);
  eclairsOnScreen = computed(() => {
    return this.eclairs.filter(eclair => {
      return eclair.pos.y < this.cr.renderer.height
          && eclair.pos.y > 0
    });
  });
  private _lastEclair?: Eclair;

  async createEclairs() {
    try {
      for (let i = 0; i < this.eclairsCount; i++) {
        this._lastEclair = new Eclair(this.cr.renderer, i, this._getPositionByLastEclair(this._lastEclair));
        this._lastEclair.setImage();
        // this._lastEclair.setGolden();
        this.eclairs.push(this._lastEclair);
      }
      this.eclairsShowed.set(this.eclairsCount);
    } catch (e) {
      console.error('Error loading image', e);
    }
  }

  resetEclair(eclair: Eclair) {
    eclair.reset(this._getPositionByLastEclair(this._lastEclair));
    eclair.setOutOfScreen();
    const goldenVal = this.cr.renderer.random();
    const golden = !this._lastEclair?.golden && goldenVal <= 0.5;
    eclair.setGolden(golden);

    this._lastEclair = eclair;
    this.eclairsShowed.update((count) => count + 1);
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

}
