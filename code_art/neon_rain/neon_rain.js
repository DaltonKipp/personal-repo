let PARTICLES = []; // Creates particle array
const NUM_PARTICLES = 2000; // Sets number of particles
const MAX_PARTICLE_SIZE = 15; // Sets maximum particle size
const X_SIN_AMPLITUDE = 0.5; // Particle X Sine Motion Amplitude
const RAD_AMPLITUDE = 0.0; // Particle Sine Radius Size Amplitude
const BACKGROUND_ALPHA = 20; // Background Alpha (acts like a fade effect)
const PARTICLE_ALPHA = 255; // Particle alpha value
const Y_SPEED_MAX = 2.5; // Maximum y speed

// Sets up project
function setup() {
  createCanvas(windowWidth, windowHeight); // Sets the canvas size
  frameRate(120); // Sets the frame rate
  background(0); // Sets background color
  generateParticles();
}

function draw() {
  for (let particle of PARTICLES) {
    particle.draw(); // Draws each particle
    particle.update(); // Updates each particle
  }
  background(0, 0, 0, BACKGROUND_ALPHA);
}

class Particle {
  constructor(x, y, color) {
    this.x = random(0, windowWidth); // Particles start at a random x position
    this.y = random(0, windowHeight); // Particles start at a random y position
    this.radius = random(0, MAX_PARTICLE_SIZE); // Particles are a random size
    this.xAngle = sin(this.y); // Random angle between 0 and 2pi
    this.angle2 = random(0, TWO_PI); // Random angle between 0 and 2pi
    this.xSpeed = X_SIN_AMPLITUDE * this.xAngle;
    this.ySpeed = random(Y_SPEED_MAX / 4, Y_SPEED_MAX); // Particles travel at a random speed
  }

  // Updates parameters of particles
  update() {
    this.radius += RAD_AMPLITUDE * sin(this.angle2);
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // if (this.y <= -this.radius*2 || this.y >= windowHeight + this.radius*2) {
    //   this.ySpeed *= -1; // Reverses y direction if outside of the boundaries
    // }
    if (this.x <= -this.radius * 2 || this.x >= windowWidth + this.radius * 2) {
      this.xSpeed *= -1; // Reverses x direction if outside of the boundaries
    }
    if (this.y >= windowHeight + this.radius * 2) {
      this.y = -this.radius * 2; // Reverses y direction if outside of the boundaries
    }
  }

  // Draws the particles
  draw() {
    if (this.radius > MAX_PARTICLE_SIZE * 0.33 && this.radius <= MAX_PARTICLE_SIZE * 0.66) {
      this.color = [255, 0, 0, PARTICLE_ALPHA];
    } else if (this.radius > MAX_PARTICLE_SIZE * 0.66 && this.radius <= MAX_PARTICLE_SIZE) {
      this.color = [0, 255, 255, PARTICLE_ALPHA];
    } else {
      this.color = [255, 255, 255, PARTICLE_ALPHA];
    }

    fill(this.color); // Fills each particle
    ellipse(this.x, this.y, this.radius);
    noStroke();
  }
}

function generateParticles() {
  // Populates particle array
  for (let i = 0; i < NUM_PARTICLES; i++) {
    PARTICLES.push(new Particle());
  }
}

// Resize the canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resizes canvas to new window dimensions
  PARTICLES = []; // Clears particle array of previous instances
  generateParticles(); // Regenerate particles for the new canvas size
  background(0); // Reset the background
}
