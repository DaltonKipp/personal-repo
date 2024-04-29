let PARTICLES = []; // Creates particle array
const NUM_PARTICLES = 2000; // Sets number of particles
const X_SIN_AMPLITUDE = 0.02; // Particle X Sine Motion Amplitude
const RAD_AMPLITUDE = 0.0; // Particle Sine Radius Size Amplitude
const BACKGROUND_ALPHA = 20; // Background Alpha (acts like a fade effect)
const PARTICLE_ALPHA = 255; // Particle alpha value

// Sets up project
function setup() {
  createCanvas(windowWidth, windowHeight); // Sets the canvas size
  frameRate(60); // Sets the frame rate
  background(25); // Sets background color

  generateParticles();
}

function draw() {
  background(0, BACKGROUND_ALPHA)
  for (let particle of PARTICLES) {
    particle.draw(); // Draws each particle
    particle.update(); // Updates each particle
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = random(0, width); // Particles start at a random x position
    this.y = random(0, height); // Particles start at a random y position
    this.radius = random(5, 25); // Particles are a random size
    this.speed = random(0.5, 1.5); // Particles travel at a random speed
    this.angle = random(0, TWO_PI); // Random angle between 0 and 2pi
    this.angle2 = random(0, TWO_PI); // Random angle between 0 and 2pi
    this.colorscale = (50 * this.x) / width; // Scale as a function of x position

    // Sets color to colorscale
    this.color = [this.colorscale, this.colorscale, this.colorscale, PARTICLE_ALPHA];
  }

  // Updates parameters of particles
  update() {

    this.radius += RAD_AMPLITUDE * sin(this.angle2);
    this.x += X_SIN_AMPLITUDE * sin(this.angle);
    this.y += this.speed;
    this.angle += random(0, 0.01);
    this.angle2 += random(0, 0.01);

    if (this.y >= height + 50) {
      this.y = 0;
    }
    
    // Sets color to red if radius is between 10 and 15
    if (this.radius >= 5 && this.radius <= 15) {
      this.color = [255, 0, 0, PARTICLE_ALPHA]; // Sets color to red

    } else if (this.radius >= 15 && this.radius <= 25) {
      this.color = [0, 255, 255, PARTICLE_ALPHA]; // Sets color to cyan
    }
  }

  // Draws the particles
  draw() {
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