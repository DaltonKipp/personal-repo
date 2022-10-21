const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let Particles = [];
let squares = [];
let hexagons = [];

const degToRad = (deg) => {
    return deg/ 180 * Math.PI
}

var slider = document.getElementById("myRange");
// var output = document.getElementById("demo");
// output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
// slider.oninput = function() {
//   output.innerHTML = this.value;
// }

// Event that tracks mouse movement and draws a rectangle when the mouse location changes
canvas.addEventListener('mousemove', function (e){
    // console.log(e.x,e.y);
    ctx.beginPath();
    ctx.rect(e.x,e.y,10,10);
    ctx.fill();
    ctx.stroke();

});

// Event that tracks mouse clicks and draws a circle when the left mouse button is clicked
canvas.addEventListener('click',function(c){
    // console.log(c.x,c.y);
    ctx.beginPath();
    ctx.arc(c.x,c.y,10,0,degToRad(360))
    ctx.fill();
})

// Event that tracks the mouse click and triggers the Particle animation.
canvas.addEventListener('mousemove',function(e){
    for (let i = 0; i < 5; i++) {
        Particles.push(new Particle(e.x,e.y));
        // console.log("Particle")
    }
})

// Event that tracks the mouse click and triggers the square animation.
canvas.addEventListener('click',function(s){
    for (let i = 0; i < 5; i++) {
        squares.push(new Square(s.x,s.y));
        // console.log("Squares")
    }
})

// Event that tracks the mouse click and triggers the square animation.
canvas.addEventListener('click',function(hex){
    for (let i = 0; i < 10; i++) {
        hexagons.push(new Hexagon(hex.x,hex.y));
        // console.log("Hexagons")
    }
})

// Animates the Particle function
const animateParticle = () => {
    Particles.forEach((Particle, index) => {
        Particle.draw();
        Particle.updateSpeed();
        Particle.updateSize();
        Particle.updateColor();

        if (Particle.radius < 0.1){
            Particles.splice(index, 1);
        }
    })
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.restore();
    // Requests a new animation frame is created
    requestAnimationFrame(animateParticle)
}

// Animates the square function
const animateSquare = () => {
    squares.forEach(square => {
        square.updateSize();
        square.draw();
        square.update();   
    })
    requestAnimationFrame(animateSquare)
}

// Animates the hexagon function
const animateHexagon = () => {
    hexagons.forEach(hexagon => {
        hexagon.update();
        hexagon.drawHexagon();
        hexagon.drawGrid();
    })
    requestAnimationFrame(animateHexagon)
}

// Calls animation functions
animateParticle();
animateSquare();
animateHexagon();

// Class that draws a series of circles moving in random directions from a point.
class Particle {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 10 + 1;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.rotate = Math.random();
    }
    // Updates the speed of the Particle
    updateSpeed(){
        this.x += this.speedX;
        this.y += this.speedY;
    }
    // Updates the size of the Particle
    updateSize(){
        this.radius -= 0.05;
    }
    // Updates the color of the Particle based on size
    updateColor(){
        ctx.beginPath();
        if (this.radius >= 0) {
            ctx.fillStyle = 'black';
        }
        if (this.radius >= 2) {
            ctx.fillStyle = 'red';
        }
        if (this.radius >= 4) {
            ctx.fillStyle = 'cyan';
        }
        if (this.radius >= 6) {
            ctx.fillStyle = 'white';
        }
    }
    // Draws the Particle particle
    draw(){
        ctx.strokeStyle = 'black';
        // ctx.arc(this.x,this.y, this.radius,0,Math.PI*2) // Draws circle particles
        ctx.rect(this.x,this.y,this.radius*5,this.radius*5) // Draws rectangle particles
        // ctx.rotate(this.rotate)
        ctx.fill();
        ctx.stroke();
    }
}

// Class that draws a series of squares.
class Square {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.x2 = x - 50;
        this.y2 = y - 50;
        this.size = 1;
    }
    // Updates the size of the square
    update(){
        this.x += Math.random()*5-10;
        this.y += Math.random()*5-10;
        this.x2 -= Math.random()*5-10;
        this.y2 -= Math.random()*5-10;
    }
    // Updates the size of the square
    updateSize(){
        this.size += Math.random() + 0.2;
    }
    // Draw the squares
    draw(){
        ctx.strokeStyle = 'black'
        ctx.beginPath();
        ctx.rect(this.x,this.y,this.size,this.size)
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(this.x2,this.y2,this.size,this.size)
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.rect(this.x2,this.y,this.size,this.size)
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.rect(this.x,this.y2,this.size,this.size)
        ctx.stroke();
        ctx.fill();
    }
}

class Hexagon {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.a = 2 * Math.PI / 6;
        this.r = canvas.width/60;
    }
    // Updates the size of the square
    update(){
        this.x += this.speed
        this.y += this.speed
    }
    
    drawHexagon(x, y) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          ctx.lineTo(x + this.r * Math.cos(this.a * i), y + this.r * Math.sin(this.a * i));
        }
        ctx.closePath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(50,50,50,0.25)';
        ctx.stroke();
        }
    
    drawGrid(width, height) {
        for (let y = this.r; y + this.r * Math.sin(this.a) < height; y += this.r * Math.sin(this.a)) {
          for (let x = this.r, j = 0; x + this.r * (1 + Math.cos(this.a)) < width; x += this.r * (1 + Math.cos(this.a)), y += (-1) ** j++ * this.r * Math.sin(this.a)) {
            drawHexagon(x, y);
          }
        }
        }
}

const point = {
    x: canvas.width / 2,
    y: canvas.height / 2
}
let degree = 0;

const ParticlePath = () => {
    Particles.push(new Particle(point.x, point.y))
    point.x += Math.cos(degree)*1000;
    point.y += Math.cos(degree)*1000;
    degree++;
    requestAnimationFrame(ParticlePath)
}

// Random Particle generation function
const generateParticles = () => {
    Particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height))
    requestAnimationFrame(generateParticles)
}

// Draw a hexagon grid
const a = 2 * Math.PI / 6;
const r = canvas.width / 90;

function init() {
  drawGrid(canvas.width, canvas.height);
  requestAnimationFrame(init);
}
init();

function drawGrid(width, height) {
  for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
    for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
      drawHexagon(x, y);
    }
  }
}

function drawHexagon(x, y) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  ctx.closePath();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(255,255,255,0.005)';
  ctx.stroke();
}

// Draws Particles along a path
ParticlePath();
// Generates random Particles on the canvas
generateParticles();