let particles = []; // Creates particle array
let numParticles = 4000; // Sets number of particles
let sinAmplitude = 2

// Sets up project
function setup() {
    createCanvas(1080, 1080); // Sets the canvas size
    frameRate(60); // Sets the frame rate
    background(25); // Sets background color

    // Populates particle array
    for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  for (let particle of particles) {
    particle.update(); // Updates each particle
    particle.draw(); // Draws each particle
    saveCanvas('Img','png')
}
}

class Particle {
  constructor() {
    this.reset();
  }
  // Resets particles
  reset() {
    this.x = random(0, width); // Particles start at a random x position
    this.y = -50; // Particles start 50 pixels out of the canvas
    this.radius = random(5, 50); // Particles are a random size
    this.speed = random(1, 10); // Particles travel at a random speed
    this.angle = random(0, TWO_PI); // Random angle between 0 and 2pi
    this.angle2 = random(0, TWO_PI); // Random angle between 0 and 2pi
    this.colorscale = (40 * this.x) / width; // Scale as a function of x position

    // Sets color to colorscale
    this.color = [this.colorscale, this.colorscale, this.colorscale, 255];

    // Sets color to red if radius is between 10 and 15
    if (this.radius >= 10 && this.radius <= 15) {
      this.color = [255, 0, 0, 255]; // Sets color to red
    }

    // Sets color to cyan if radius is between 15 and 20
    if (this.radius >= 15 && this.radius <= 20) {
      this.color = [0, 255, 255, 255]; // Sets color to cyan
    }
  }

  // Updates parameters of particles
  update() {
    this.radius += 0.5 * sin(this.angle2);
    this.x = this.x + sinAmplitude * sin(this.angle);
    this.y += this.speed;
    this.angle += random(0, 0.2);
    this.angle2 += random(0, 0.2);
    if (this.y >= height + 50) {
      this.reset();
    }
  }

  // Draws the particles
  draw() {
    fill(this.color); // Fills each particle
    ellipse(this.x, this.y, this.radius);
    noStroke();
  }
}
