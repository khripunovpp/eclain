import {inject, Injectable} from '@angular/core';
import p5 from "p5";
import {CanvasRendererService} from "./canvas-renderer.service";

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  constructor() {
  }

  private readonly assets = new Map<string, p5.Image>();
  private readonly cr = inject(CanvasRendererService);

  loadAssets() {
    return Promise.allSettled(
        [
          'eclair.png',
          'pop.png'
        ].map((name) => new Promise((resolve, reject) => this.cr.renderer.loadImage(
            `/${name}`,
            (img: p5.Image) => {
              this.assets.set(name.split('.')[0], img);
              resolve(img);
            },
            (err: any) => reject(err),
        )))
    )
  }

  get(name: string) {
    return this.assets.get(name);
  }
}
