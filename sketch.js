let movers = [];
let G = 0.1;
let wind = 0;
let colorlist = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'];

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 10; i++) {
    movers.push(
      new Mover(
        random(width),
        random(height),
        random(-1, 1),
        random(-1, 1),
        10,
        random(colorlist)
      )
    );
  }
  ellipseMode(RADIUS);
}

function draw() {
  background(220);

  for (let mover of movers) {
    let gravity = createVector(0, G);
    let windForce = createVector(wind, 0);
    mover.applyForce(gravity);
    mover.applyForce(windForce);
    mover.update();
  }

  // Check collisions
  for (let i = 0; i < movers.length; i++) {
    for (let j = i + 1; j < movers.length; j++) {
      movers[i].checkCollision(movers[j]);
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    wind = random(-0.5, 0.5); // Gust of wind
  }
}

class Mover {
  constructor(x, y, dx, dy, r, c) {
    this.position = createVector(x, y);
    this.velocity = createVector(dx, dy);
    this.acceleration = createVector(0, 0);
    this.r = r;
    this.c = c;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0); // Reset acceleration
    this.containWithinWindow();
    this.draw();
  }

  draw() {
    fill(this.c);
    circle(this.position.x, this.position.y, this.r);
  }

  containWithinWindow() {
    if (this.position.x < this.r) {
      this.position.x = this.r;
      this.velocity.x *= -1;
    }
    if (this.position.x > width - this.r) {
      this.position.x = width - this.r;
      this.velocity.x *= -1;
    }
    if (this.position.y < this.r) {
      this.position.y = this.r;
      this.velocity.y *= -1;
    }
    if (this.position.y > height - this.r) {
      this.position.y = height - this.r;
      this.velocity.y *= -1;
    }
  }

  checkCollision(other) {
    let dx = other.position.x - this.position.x;
    let dy = other.position.y - this.position.y;
    let distance = sqrt(dx * dx + dy * dy);
    let minDist = this.r + other.r;

    if (distance < minDist) {
      let angle = atan2(dy, dx);
      let targetX = this.position.x + cos(angle) * minDist;
      let targetY = this.position.y + sin(angle) * minDist;
      let ax = (targetX - other.position.x) * 0.05;
      let ay = (targetY - other.position.y) * 0.05;

      this.velocity.x -= ax;
      this.velocity.y -= ay;
      other.velocity.x += ax;
      other.velocity.y += ay;
    }
  }
}
