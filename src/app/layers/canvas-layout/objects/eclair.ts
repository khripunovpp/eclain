import {CanvasRenderer} from "../../../services/canvas-renderer.service";
import p5 from "p5";

export class Eclair {
  constructor(
      private cr: CanvasRenderer,
      public id: number,
      public pos: p5.Vector,
  ) {
  }

  velocity = this.cr.createVector(0, 1);
  _img: any;
  imgWidth = 20;
  imgHeight = this.imgWidth;

  update(
      time: number,
  ) {
    this.pos.add(this.velocity);
  }

  setImage(img: any) {
    this._img = img;
    this._img.resize(this.imgWidth, this.imgHeight);
  }

  display() {
    this.cr.image(this._img, this.pos.x - this.imgWidth / 2, this.pos.y - this.imgHeight / 2);

    // // set text inside the elipse with cords and id
    // this.cr.textSize(12);
    // this.cr.textAlign(this.cr.CENTER, this.cr.CENTER);
    // this.cr.text("x: " + this.pos.x.toFixed(2), this.pos.x, this.pos.y - 10);
    // this.cr.text("y: " + this.pos.y.toFixed(2), this.pos.x, this.pos.y + 10);
    // this.cr.text("id: " + this.id, this.pos.x, this.pos.y + 30);
  }
}