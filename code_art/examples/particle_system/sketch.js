// Frank's Laboratory
// Video Link: https://www.youtube.com/watch?v=5dIbK0auaB8&list=PLsPnqXfykr1cMSF0ew3NS4hAx0NwfYnOA&index=4&ab_channel=Frankslaboratory

// setup
const canvas = document.getElementById("canvas1"); // Defines Canvas
const ctx = canvas.getContext("2d"); // Defines 2D Context
canvas.width = window.innerWidth; // Sets canvas width to window width
canvas.height = window.innerHeight; // Sets canvas height to window height

// Defines color gradient stops
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); // Creates linear color gradient
gradient.addColorStop(0, "cyan");
gradient.addColorStop(0.5, "white");
gradient.addColorStop(1, "red");

// Canvas Styling
ctx.fillStyle = gradient; // Sets global fill style
ctx.strokeStyle = gradient; // Sets global stroke style
ctx.linewidth = 5;

// Global Constants
const NUM_PARTICLES = 500;
const MAX_PARTICLE_SIZE = 20;
const MAX_PARTICLE_SPEED = 0.5;
const MAX_LINE_DISTANCE = 150;
const MOUSE_RADIUS = 100;
const PARTICLE_FRICTION = 0.9;

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.radius = Math.abs(Math.random() * MAX_PARTICLE_SIZE + 2);
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.vx = Math.random() * MAX_PARTICLE_SPEED - MAX_PARTICLE_SPEED / 2;
    this.vy = Math.random() * MAX_PARTICLE_SPEED - MAX_PARTICLE_SPEED / 2;
    this.pushX = 0;
    this.pushY = 0;
    this.friction = PARTICLE_FRICTION;
  }
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    //context.stroke();
  }
  update() {
    // Calculates distance from mouse position to the particle
    if (this.effect.mouse.pressed) {
      const dx = this.x - this.effect.mouse.x;
      const dy = this.y - this.effect.mouse.y;
      const distance = Math.hypot(dx, dy);
      const force = this.effect.mouse.radius / distance;
      if (distance < this.effect.mouse.radius) {
        const angle = Math.atan2(dy, dx);
        this.pushX += Math.cos(angle) * force;
        this.pushY += Math.sin(angle) * force;
      }
    }

    this.x += (this.pushX *= this.friction) + this.vx;
    this.y += (this.pushY *= this.friction) + this.vy;

    // Bounces particles back if they leave the window area
    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx *= -1;
    } else if (this.x > this.effect.width - this.radius) {
      this.x = this.effect.width - this.radius;
      this.vx *= -1;
    }
    if (this.y < this.radius) {
      this.y = this.radius;
      this.vy *= -1;
    } else if (this.y > this.effect.height - this.radius) {
      this.y = this.effect.height - this.radius;
      this.vy *= -1;
    }
  }
  // Handles resetting particles after window resize
  reset() {
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
  }
}

class Effect {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = NUM_PARTICLES;
    this.createParticles();

    this.mouse = {
      x: 0,
      y: 0,
      pressed: false,
      radius: MOUSE_RADIUS,
    };
    // Listens for resizing of the canvas
    window.addEventListener("resize", (e) => {
      this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
    });
    // Listens for mouse movement
    window.addEventListener("mousemove", (e) => {
      if (this.mouse.pressed) {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      }
    });
    // Listens for left mouse click
    window.addEventListener("mousedown", (e) => {
      this.mouse.pressed = true;
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });
    // Listens for mouse up
    window.addEventListener("mouseup", (e) => {
      this.mouse.pressed = false;
    });
  }
  // Creates particle class instances
  createParticles() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }
  // Draws Particles and Lines
  handleParticles(context) {
    this.connectParticles(context);
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }
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
const effect = new Effect(canvas, ctx);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.handleParticles(ctx);
  requestAnimationFrame(animate);
}
animate();
