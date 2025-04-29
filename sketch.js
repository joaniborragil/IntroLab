let particles = [];
let G = 0.1;
let wind = 0;
let colorlist = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6'];
let gravitySlider;
let windEnabled = false;

function setup() {
  createCanvas(600, 400);
  gravitySlider = createSlider(0, 1, 0.1, 0.01);
  gravitySlider.position(10, 10);
  gravitySlider.style('width', '100px');

  for (let i = 0; i < 12; i++) {
    particles.push(new Particle(
      random(width),
      random(height),
      random(-1, 1),
      random(-1, 1),
      random(8, 15),
      random(colorlist)
    ));
  }

  ellipseMode(RADIUS);
}

function draw() {
  background(0, 20); // Trails effect with slight transparency
  G = gravitySlider.value();

  for (let p of particles) {
    let gravity = createVector(0, G);
    let windForce = createVector(windEnabled ? wind : 0, 0);
    p.applyForce(gravity);
    p.applyForce(windForce);
    p.update();
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      particles[i].checkCollision(particles[j]);
    }
  }

  fill(255);
  textSize(12);
  text("Gravity: " + nf(G, 1, 2), 120, 20);
  text("Press W to toggle wind | Click to attract particles", 10, height - 10);
}

function keyPressed() {
  if (key === 'W' || key === 'w') {
    windEnabled = !windEnabled;
    wind = random(-0.3, 0.3);
  }
}

function mousePressed() {
  for (let p of particles) {
    let pull = createVector(mouseX - p.position.x, mouseY - p.position.y);
    pull.setMag(0.3);
    p.applyForce(pull);
  }
}

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

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.containWithinWindow();
    this.display();
  }

  display() {
    fill(this.c);
    noStroke();
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
      // Change color on collision
      this.c = random(colorlist);
      other.c = random(colorlist);

      // Elastic collision
      let normal = createVector(dx, dy).normalize();
      let relativeVelocity = p5.Vector.sub(this.velocity, other.velocity);
      let speed = relativeVelocity.dot(normal);

      if (speed < 0) return;

      let impulse = normal.mult(speed);
      this.velocity.sub(impulse);
      other.velocity.add(impulse);
    }
  }
}

