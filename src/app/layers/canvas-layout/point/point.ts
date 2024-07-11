import p5 from "p5";

export class Point {
  constructor(
      x: number,
      y: number,
  ) {
    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(0,0);
    this.acceleration = new p5.Vector(0,0);
  }

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
    p.clear();
    p.stroke(255);
    p.strokeWeight(2);
    p.fill(255, 100);
    p.push();
    p.translate(this.position.x, this.position.y);
    p.ellipse(this.position.x, this.position.y, 20, 20);
    p.pop();
  }
}