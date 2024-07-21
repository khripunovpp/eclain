import {CanvasRenderer} from "../../../services/canvas-renderer.service";

export class Eclair {
  constructor(
      private cr: CanvasRenderer,
      public id: number,
  ) {
  }

  pos = this.cr.createVector(this.cr.random(this.cr.width), -this.cr.random(this.cr.height));
  velocity = this.cr.createVector(0, 1);
  // size = this.cr.random(2, 5)
  radius = 20
  color = 255

  update(
      time: number,
  ) {
    this.pos.add(this.velocity);

    if (this.pos.y > this.cr.height) {
      this.reset();
    }
  }

  display() {
    this.cr.fill(this.color);
    this.cr.noStroke();
    this.cr.ellipse(this.pos.x, this.pos.y, this.radius, this.radius);

    // set text inside the elipse with cords and id
    this.cr.textSize(12);
    this.cr.textAlign(this.cr.CENTER, this.cr.CENTER);
    this.cr.text("x: " + this.pos.x.toFixed(2), this.pos.x, this.pos.y - 10);
    this.cr.text("y: " + this.pos.y.toFixed(2), this.pos.x, this.pos.y + 10);
    this.cr.text("id: " + this.id, this.pos.x, this.pos.y + 30);
  }

  reset() {
    this.pos.set(this.cr.random(this.cr.width), -50);
  }
}