const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let Hexagons = [];

// Animates the Hexagon function
const animateHexagon = () => {
    Hexagons.forEach((Hexagon, index) => {
        Hexagon.draw();
        Hexagon.updateSpeed();
        Hexagon.updateSize();
        Hexagon.updateColor();

        if (Hexagon.radius > 100){
            Hexagons.splice(index, 1);
        }
        if (Hexagon.x > canvas.width){
            Hexagons.splice(index, 1);
        }
        if (Hexagon.y > canvas.height){
            Hexagons.splice(index, 1);
        }
    })
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.09)';
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.restore();
    // Requests a new animation frame is created
    requestAnimationFrame(animateHexagon)
}

// Class that draws a series of circles moving in random directions from a point.
class Hexagon {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.radius = Math.random() * canvas.width/1000 + 1;
        this.speedX = Math.random() * 20 - 10;
        this.speedY = Math.random() * 20 - 10;
        this.color = 0;
    }
    // Updates the speed of the Hexagon
    updateSpeed(){
        this.x += this.speedX;
        this.y += this.speedY;
    }
    // Updates the size of the Hexagon
    updateSize(){
        this.radius += 0.5;
    }
    // Updates the color of the Hexagon based on size
    updateColor(){
        ctx.beginPath();
        this.color += 3;
        if (this.color >= 150){
            this.color = 0;
        }
        if (this.color >= 0) {
            ctx.fillStyle = 'red';
        }
        if (this.color >= 50) {
            ctx.fillStyle = 'cyan';
        }
        if (this.color >= 100) {
            ctx.fillStyle = 'white';
        }
        }
    // Draws the Hexagon
    draw(){
        const a = 2 * Math.PI / 6;
        const r = this.radius;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          ctx.lineTo(this.x + r * Math.cos(a * i), this.y + r * Math.sin(a * i));
        }
        ctx.closePath();
        ctx.lineWidth = this.radius/20;
        ctx.stroke();
        ctx.fill();
    }
}

const point = {
    x: canvas.width / 2,
    y: canvas.height / 2
}
let degree = 0;

// Random Hexagon generation function
const generateHexagons = () => {
    Hexagons.push(new Hexagon(0, canvas.height/2))
    Hexagons.push(new Hexagon(canvas.width, canvas.height/2))
    Hexagons.push(new Hexagon(canvas.width/2,canvas.height/2))
    requestAnimationFrame(generateHexagons)
}

// Draw a hexagon grid
const a = 2 * Math.PI / 6;
const r = canvas.width / 100;

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
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0,0,0,0.9)';
  ctx.stroke();
}

// Calls animation functions
animateHexagon();

// Generates random Hexagons on the canvas
generateHexagons();