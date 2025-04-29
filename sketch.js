class Particle {
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

  applyFriction() {
    if (this.position.y >= height - this.r) {
      let friction = this.velocity.copy().normalize().mult(-0.1);
      this.applyForce(friction);
    }
  }

  update() {
    this.applyFriction();
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.containWithinWindow();
    this.display();
  }

  display() {
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

let particles = [];
let G = 0.1;
let wind = 0;
let colorlist = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0'];

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(
      random(width),
      random(height),
      random(-1, 1),
      random(-1, 1),
      10,
      random(colorlist)
    ));
  }
  ellipseMode(RADIUS);
}

function draw() {
  background(220);
  for (let p of particles) {
    p.applyForce(createVector(0, G));
    p.applyForce(createVector(wind, 0));
    p.update();
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      particles[i].checkCollision(particles[j]);
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    wind = random(-0.5, 0.5);
  } else if (keyCode === LEFT_ARROW) {
    wind = -0.3;
  } else if (keyCode === RIGHT_ARROW) {
    wind = 0.3;
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    wind = 0;
  }
}

function mousePressed() {
  for (let p of particles) {
    let pull = createVector(mouseX - p.position.x, mouseY - p.position.y);
    pull.setMag(0.2);
    p.applyForce(pull);
  }
}
