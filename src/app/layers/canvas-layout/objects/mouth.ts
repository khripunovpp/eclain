import {CanvasRenderer} from "../../../services/canvas-renderer.service";
import {PointCords} from "../../../services/points.service";
import {PointNameAsSting} from "../../../services/movenet-model.service";

export class Mouth {
  constructor(
      public cr: CanvasRenderer,
      public upperLip: PointCords[PointNameAsSting],
      public lowerLip: PointCords[PointNameAsSting],
      public leftCornerOfMouth: PointCords[PointNameAsSting],
      public rightCornerOfMouth: PointCords[PointNameAsSting],
  ) {
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

  show() {
    this.cr.stroke(255);
    this.cr.strokeWeight(2);
    this.cr.fill(255);
    this.cr.push();
    this.cr.rect(
        this.leftCornerOfMouth.x,
        this.upperLip.y,
        this.rightCornerOfMouth.x - this.leftCornerOfMouth.x,
        this.lowerLip.y - this.upperLip.y
    );
    this.cr.pop();
  }
}
