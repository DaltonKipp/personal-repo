const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

  };
};

canvasSketch(sketch, settings);

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
        if (Hexagon.x > width){
            Hexagons.splice(index, 1);
        }
        if (Hexagon.y > height){
            Hexagons.splice(index, 1);
        }
    })
    context.save();
    context.fillStyle = 'rgba(0,0,0,0.09)';
    context.fillRect(0,0,width,height)
    context.restore();
    // Requests a new animation frame is created
    requestAnimationFrame(animateHexagon)
}

// Class that draws a series of circles moving in random directions from a point.
class Hexagon {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.radius = Math.random() * width/1000 + 1;
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
        context.beginPath();
        this.color += 3;
        if (this.color >= 150){
            this.color = 0;
        }
        if (this.color >= 0) {
            context.fillStyle = 'red';
        }
        if (this.color >= 50) {
            context.fillStyle = 'cyan';
        }
        if (this.color >= 100) {
            context.fillStyle = 'white';
        }
        }
    // Draws the Hexagon
    draw(){
        const a = 2 * Math.PI / 6;
        const r = this.radius;
        context.strokeStyle = 'black';
        context.beginPath();
        for (let i = 0; i < 6; i++) {
          context.lineTo(this.x + r * Math.cos(a * i), this.y + r * Math.sin(a * i));
        }
        context.closePath();
        context.lineWidth = this.radius/20;
        context.stroke();
        context.fill();
    }
}

const point = {
    x: width / 2,
    y: height / 2
}
let degree = 0;

// Random Hexagon generation function
const generateHexagons = () => {
    Hexagons.push(new Hexagon(0, height/2))
    Hexagons.push(new Hexagon(width, height/2))
    Hexagons.push(new Hexagon(width/2,height/2))
    requestAnimationFrame(generateHexagons)
}

// Draw a hexagon grid
const a = 2 * Math.PI / 6;
const r = width / 100;

function init() {
  drawGrid(width, height);
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
  context.beginPath();
  for (let i = 0; i < 6; i++) {
    context.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  context.closePath();
  context.lineWidth = 2;
  context.strokeStyle = 'rgba(0,0,0,0.9)';
  context.stroke();
}

// Calls animation functions
animateHexagon();

// Generates random Hexagons on the canvas
generateHexagons();