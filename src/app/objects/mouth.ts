import {CanvasRenderer} from "../services/canvas-renderer.service";
import {PointCords} from "../services/points.service";
import p5 from "p5";

export class Mouth {
  constructor(
      public cr: CanvasRenderer,
      public pointCords: PointCords,
  ) {
  }

  get position() {
    return this.cr.createVector(
        this.pointCords.rightCornerOfMouth.x,
        this.pointCords.upperLip.y,
    );
  }

  get width() {
    return 60;
    // return Math.abs(this.pointCords.rightCornerOfMouth.x - this.pointCords.leftCornerOfMouth.x);
  }

  get height() {
    return 30;
    // return Math.abs(this.pointCords.lowerLip.y - this.pointCords.upperLip.y) * 2.5;
  }

  update() {

  }

  collidePointRect(
      point: p5.Vector,
  ) {
    if (!this.cr) return false;
    if (this.position.x <= point.x
        && this.position.x + this.width >= point.x
        && this.position.y <= point.y
        && this.position.y + this.height >= point.y) {
      return true;
    } else {
      return false;
    }
  }

  show() {
    this.cr.fill(255);
    this.cr.push();
    this.cr.rect(
        this.position.x,
        this.position.y,
        this.width,
        this.height,
    );
    this.cr.pop();
  }
}
