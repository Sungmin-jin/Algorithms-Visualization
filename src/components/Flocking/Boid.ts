import p5Type, { Vector } from 'p5';

export default class Boid {
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  velocity: p5Type.Vector;
  acceleration: p5Type.Vector;
  p5: p5Type;
  width: number;
  height: number;
  maxspeed: number;
  maxforce: number;
  r: number;
  position: p5Type.Vector;
  constructor(x: number, y: number, p5: p5Type, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.position = p5.createVector(x, y);
    this.velocity = p5.createVector(p5.random(-3, 3), p5.random(-3, 3));
    this.acceleration = p5.createVector(0, 0);
    this.p5 = p5;
    this.width = width;
    this.height = height;
    this.r = 50.0;
    this.maxspeed = 3;
    this.maxforce = 0.05;
  }

  centering() {
    const centerXDiff = this.centerX - this.position.x;
    const centerYDiff = this.centerY - this.position.y;

    const xRatio = (centerXDiff / this.centerX) * 0.6;
    const yRatio = centerYDiff / this.centerY;

    this.acceleration.x += 0.05 * xRatio;
    this.acceleration.y += 0.05 * yRatio;
  }

  edge() {
    const vel = 1;
    if (this.position.x <= 0) {
      this.velocity.x = vel;
      this.acceleration.x *= -1;
      this.acceleration.x += 3 * Math.sign(this.acceleration.x);
    }
    if (this.position.y <= 0) {
      this.velocity.y = vel;
      this.acceleration.y *= -1;
      this.acceleration.y += 3 * Math.sign(this.acceleration.y);
    }
    if (this.position.x >= this.width - this.r) {
      this.velocity.x = -vel;
      this.acceleration.x *= -1;
      this.acceleration.x += 3 * Math.sign(this.acceleration.x);
    }
    if (this.position.y >= this.height - this.r) {
      this.velocity.y = -vel;
      this.acceleration.y *= -1;
      this.acceleration.y += 3 * Math.sign(this.acceleration.y);
    }
  }

  seek(target: p5Type.Vector) {
    const desired = Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    const steer = Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }

  align(boids: Boid[]) {
    const perception = 50;
    const sum = this.p5.createVector(0, 0);
    let count = 0;
    for (const boid of boids) {
      const d = Vector.dist(this.position, boid.position);
      if (d > 0 && d < perception && boid !== this) {
        sum.add(boid.velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      const steer = Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    }
    return this.p5.createVector(0, 0);
  }

  cohesion(boids: Boid[]) {
    const perception = 50;
    const sum = this.p5.createVector(0, 0);
    let count = 0;
    for (const boid of boids) {
      const d = Vector.dist(this.position, boid.position);
      if (d > 0 && d < perception && boid !== this) {
        sum.add(boid.position);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    }
    return this.p5.createVector(0, 0);
  }

  separate(boids: Boid[]) {
    const perception = 40.0;
    const steer = this.p5.createVector(0, 0);
    let count = 0;

    for (const boid of boids) {
      const d = Vector.dist(this.position, boid.position);
      if (d > 0 && d < perception && boid !== this) {
        const diff = Vector.sub(this.position, boid.position);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }

    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.x = this.position.x;
    this.y = this.position.y;
    this.acceleration.mult(0);
  }

  flock(boids: Boid[]) {
    const separation = this.separate(boids);
    const alignment = this.align(boids);
    const cohesion = this.cohesion(boids);
    separation.mult(1.5);
    alignment.mult(1.0);
    cohesion.mult(1.0);

    this.acceleration.add(separation);
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
  }

  render(image: p5Type.Image) {
    this.p5.fill(127);
    this.p5.stroke(200);
    this.p5.push();
    this.p5.translate(this.x, this.y);
    this.p5.rotate(this.velocity.heading());
    this.p5.imageMode(this.p5.CENTER);
    this.p5.image(image, 0, 0, this.r, this.r);
    this.p5.pop();
  }
}
