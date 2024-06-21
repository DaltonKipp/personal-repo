// Setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillRect(0, 0, canvas.width, canvas.height);
var time = 0;

// Constants
const NUM_PARTICLES = 1000;
const MAX_PARTICLE_SIZE = 25;
const MAX_PARTICLE_SPEED = 0.5;
const LINE_WIDTH = 5;
const MAX_LINE_DISTANCE = 100;
const SIN_FACTOR = 100;

// Canvas styling
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); // Creates linear color gradient
gradient.addColorStop(0, "cyan");
gradient.addColorStop(0.5, "white");
gradient.addColorStop(1, "red");
ctx.fillStyle = gradient; // Sets global fill style
ctx.strokeStyle = gradient; // Sets global stroke style
ctx.lineWidth = 1;

// Particle Class - Handles particle objects
class Particle {
  constructor(x, effect) {
    this.effect = effect;
    this.radius = Math.abs(Math.random() * MAX_PARTICLE_SIZE + 1);
    this.x = x;
    this.y = canvas.height / 2 + (canvas.height / 2) * Math.sin(this.x / SIN_FACTOR);
    this.vx = 1 + MAX_PARTICLE_SPEED / 2 + MAX_PARTICLE_SPEED * Math.sin(this.y / SIN_FACTOR);
    this.vy = 1 + Math.sin(this.x);
  }
  // Creates circular particle
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x > this.effect.width + this.radius * 2 || this.x < -this.radius * 2) {
      this.x = -this.radius;
    }
    if (this.y > this.effect.height || this.y < -this.radius) {
      this.y = -this.radius;
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

    // Listens for resizing of the canvas
    window.addEventListener("resize", (e) => {
      this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
    });
  }
  // Creates particle instances
  createParticles() {
    const col = Math.ceil(canvas.width / NUM_PARTICLES);
    for (let i = 0; i < NUM_PARTICLES; i++) {
      this.particles.push(new Particle(i * col, this));
    }
  }
  // Handles particle instances
  handleParticles(context) {
    this.connectParticles(context);
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }
  // Connect particles with a line
  // Connects Particles With a Line
  connectParticles(context) {
    const maxDistance = MAX_LINE_DISTANCE;
    for (let a = 0; a < this.particles.length; a++) {
      for (let b = a; b < this.particles.length; b++) {
        const dx = this.particles[a].x - this.particles[b].x;
        const dy = this.particles[a].y - this.particles[b].y;
        const distance = Math.hypot(dx, dy);
        if (distance < maxDistance) {
          context.save();
          context.lineWidth = LINE_WIDTH;
          const opacity = 1 - distance / maxDistance;
          context.globalAlpha = opacity;
          context.beginPath();
          context.moveTo(this.particles[a].x, this.particles[a].y);
          context.lineTo(this.particles[b].x, this.particles[b].y);
          context.stroke();
          context.restore();
        }
      }
    }
  }
  // Handles resizing canvas
  // Updates canvas after resizing the window
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    const gradient = this.context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "cyan");
    gradient.addColorStop(0.5, "white");
    gradient.addColorStop(1, "red");
    this.context.fillStyle = gradient;
    this.context.strokeStyle = gradient;
    this.particles.forEach((particle) => {
      particle.reset();
    });
  }
}

// Creates effect class instance
const effect = new Effect(canvas, ctx);

// Animation loop function
function animate() {
  time += 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.handleParticles(ctx);
  // console.log("effect.handleParticles");
  requestAnimationFrame(animate);
  // console.log("Animation Frame");
}

animate();
