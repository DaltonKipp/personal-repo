let ringArray = [];  // Initializes ringArray
let shapeArray = []; // Initializes shapeArray

const numRings = 10;     // Number of rings
const ringSpacing = 100; // Spacing between rings
const numPoints = 50;    // Number of points
const numShapes = 100;   // Number of shapes

function setup() {
  createCanvas(windowWidth, windowHeight); // Creates Canvas
  background(255);                         // Sets initial background color
  generateRings();                         // Creates rings in the ringArray
  console.log('Ring Array: ', ringArray)   // Logs ring array to console
  generateShapes();                        // Creates shapes in the shapeArray
  console.log('Shape Array: ', shapeArray) // Logs shape array to console
}

// Draw funtion
function draw() {

  background(50); // Continuously draw the background

  ringArray.forEach((Ring, index) => {
    Ring.createPoints(); // Creates points
    Ring.createRings();  // Creates rings
    Ring.update();       // Updates objects
  });

  shapeArray.forEach((Shape, index) => {
    Shape.drawCircle(); // Draws circles
    Shape.update();     // Updates objects
  });
}

function generateRings() { // Stores Ring class instances in the ringArray
  for (let i = 0; i < numRings; i++) { 
    ringArray.push(new Ring(windowWidth/2, windowHeight/2, i * ringSpacing, [0, 255, 255]));
  }
}

function generateShapes() { // Stores Shape class instances in the shapeArray
  for (let i = 0; i < numPoints; i++) {
    for (let j = 0; j < numRings; j++) {
      let angle = map(i, 0, numPoints, 0, TWO_PI);
      let xPos = ringArray[j].x;
      let yPos = ringArray[j].y;
      let radPos = ringArray[j].ringRadius;
      let x = xPos + cos(angle) * radPos;
      let y = yPos + sin(angle) * radPos;
      shapeArray.push(new Shape(x, y, radPos, 15, angle, [255, 255, 255]));
    }
  }
}

// Ring class
class Ring {
  constructor(x, y, ringRadius, ringColor) {
    this.x = x;
    this.y = y;
    this.initRadius = ringRadius; // Stores initial radius
    this.ringRadius = ringRadius;
    this.radSpeed = 1;
    this.ringColor = ringColor;
  }


  createPoints() { // Creates points along the rings
    for (let i = 0; i < numPoints; i++) {
      let angle = map(i, 0, numPoints, 0, TWO_PI);
      let x = this.x + cos(angle) * this.ringRadius;
      let y = this.y + sin(angle) * this.ringRadius;
      point(x, y);
      stroke(255,255,0);
    }
  }  

  createRings() { // Creates rings
    for (let i = 0; i < numRings; i++) {
      noFill();
      ellipse(this.x, this.y, this.ringRadius * 2, this.ringRadius * 2);
      stroke(this.ringColor);
      strokeWeight(5);
    }
  }

  update() { // Updates rings
    this.ringRadius += this.radSpeed;
    if (this.ringRadius >= this.initRadius + 2*ringSpacing
      || this.ringRadius <= this.initRadius - 2*ringSpacing) {
      this.radSpeed *= -1;
    }
  }
}

class Shape {
  constructor(x, y, radPos, size, angle, color) {
    this.x = x;
    this.y = y;
    this.radPos = radPos;
    this.size = size;
    this.angle = angle;
    this.color = color;
  }

  drawCircle() { // Draws circles
    fill(this.color);
    let x = this.x + cos(this.angle) * this.radPos;
    let y = this.y + sin(this.angle) * this.radPos;
    ellipse(x, y, this.size, this.size);
    noStroke();
  }
  

  update() {
    this.angle += 0.01
  }
}
