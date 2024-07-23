import {CanvasRenderer} from "../services/canvas-renderer.service";

export class BaseObject {
  constructor(
    public cr: CanvasRenderer
  ) {
  }

  copyImage(img: any) {
    const clone = this.cr.createImage(img.width, img.height);
    clone.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    return clone;
  }
}