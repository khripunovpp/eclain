import {CanvasRenderer} from "../../../services/canvas-renderer.service";
import {PointCords} from "../../../services/points.service";
import {PointNameAsSting} from "../../../services/movenet-model.service";
import p5 from "p5";

export class Mouth {
  constructor(
      public cr: CanvasRenderer,
      public upperLip: PointCords[PointNameAsSting],
      public lowerLip: PointCords[PointNameAsSting],
      public leftCornerOfMouth: PointCords[PointNameAsSting],
      public rightCornerOfMouth: PointCords[PointNameAsSting],
  ) {
  }

  get position() {
    return this.cr.createVector(
        this.leftCornerOfMouth.x,
        this.upperLip.y,
    );
  }

  get width() {
    return Math.abs(this.rightCornerOfMouth.x - this.leftCornerOfMouth.x);
  }

  get height() {
    return Math.abs(this.lowerLip.y - this.upperLip.y);
  }

  static factory = (cr: CanvasRenderer, cords: PointCords) => {
    return new Mouth(
        cr,
        cords.upperLip,
        cords.lowerLip,
        cords.leftCornerOfMouth,
        cords.rightCornerOfMouth,
    )
  }

  update() {

  }

  collidePointRect(
      point: p5.Vector,
  ) {
    if (!this.cr) return false;
    console.log({
      point,
      position: this.position,
      width: this.width,
      height: this.height,

    })
    return this.cr.collidePointRectVector(
        point,
        this.position,
        this.width,
        this.height,
    );
  }

  show() {
    this.cr.stroke(255);
    this.cr.strokeWeight(2);
    this.cr.fill(255);
    this.cr.push();
    this.cr.rect(
        0,
        (this.cr.height - 10) / 2,
        this.cr.width,
        10,
    );
    this.cr.pop();
  }
}
