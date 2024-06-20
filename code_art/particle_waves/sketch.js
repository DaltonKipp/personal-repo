// Setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Constants
const NUM_PARTICLES = 4000;
const MAX_PARTICLE_SIZE = 5;
const MAX_PARTICLE_SPEED = 5.0;
const SIN_FACTOR = 100;

// Canvas styling
const gradient = ctx.createLinearGradient(0, canvas.height / 2, canvas.width, canvas.height / 2); // Creates linear color gradient
gradient.addColorStop(0, "cyan");
gradient.addColorStop(0.5, "white");
gradient.addColorStop(1, "red");
ctx.fillStyle = gradient; // Sets global fill style
ctx.strokeStyle = gradient; // Sets global stroke style
ctx.linewidth = 5;

// Particle Class - Handles particle objects
class Particle {
  constructor(x, effect) {
    this.effect = effect;
    this.radius = Math.abs(Math.random() * MAX_PARTICLE_SIZE + 1);
    this.x = x;
    this.y = canvas.height / 2 + (canvas.height / 2) * Math.sin(this.x / SIN_FACTOR);
    this.vx = 2 + Math.sin(this.y / SIN_FACTOR);
    this.vy = Math.sin(this.x);
  }
  // Creates circular particle
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }

  update() {
    this.x += this.vx;
    //this.y += this.vy;
    if (this.x > this.effect.width || this.x < -this.radius) {
      this.x = -this.radius;
    }
    if (this.y > this.effect.height || this.y < -this.radius) {
      this.vy *= -1;
    }
  }

  reset() {}
}

// Effect Class - Handles effect Changes to particles
class Effect {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.createParticles();
  }
  // Creates particle instances
  createParticles() {
    const col = Math.ceil(canvas.width / NUM_PARTICLES);
    for (let i = 0; i < NUM_PARTICLES; i++) {
      this.particles.push(new Particle(i * col, this));
      console.log(this.particles);
    }
  }
  // Handles particle instances
  handleParticles(context) {
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }
  // Connect particles with a line
  connectParticles() {}

  // Handles resizing canvas
  resize() {}
}

// Creates effect class instance
const effect = new Effect(canvas, ctx);

// Animation loop function
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.handleParticles(ctx);
  // console.log("effect.handleParticles");
  requestAnimationFrame(animate);
  // console.log("Animation Frame");
}

animate();
