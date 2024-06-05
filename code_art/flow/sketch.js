let particles = [];
let backgroundAlpha = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(120);
  background(0);
  angleMode(DEGREES);
  // Create particles
  for (let i = 0; i < 2000; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0, backgroundAlpha);

  // Update and display particles
  for (let particle of particles) {
    particle.update();
    particle.draw();
  }
}

class Particle {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.radius = random(5, 20);
    this.angle = random(360); // Random initial angle
    this.speed = random(1, 10);
    this.alpha = 225; // Initial alpha value
    this.r = random(0, 255);
    this.g = random(0, 255);
    this.b = random(255, 255);
  }

  update() {
    this.x += this.speed * 1.0 * Math.cos(this.angle);
    this.y += this.speed * 1.0 * Math.sin(this.angle);
    this.angle += 0.01;
  }

  draw() {
    // Set up properties for the glowing effect
    let col = color(this.r, this.g, this.b, this.alpha);
    fill(col);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }
}