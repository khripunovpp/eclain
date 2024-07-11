import p5 from "p5";

export class Point {
  constructor(
      x: number,
      y: number,
      color: string,
  ) {
    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(0, 0);
    this.acceleration = new p5.Vector(0, 0);
    this.color = color;
  }

  color: string;
  velocity: p5.Vector;
  position: p5.Vector;
  acceleration: p5.Vector;

  update(
      p: p5,
  ) {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.set(0, 0);
  }

  show(
      p: p5,
  ) {
    p.stroke(255);
    p.strokeWeight(2);
    p.fill(this.color);
    p.push();
    p.ellipse(this.position.x, this.position.y, 2, 2);
    p.pop();
  }
}