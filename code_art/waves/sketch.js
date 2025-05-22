let ringArray = []; // Initializes ringArray
let shapeArray = []; // Initializes shapeArray

const numRings = 20; // Number of rings
const ringSpacing = 5; // Spacing between rings
const numPoints = 20; // Number of points
const numShapes = 100; // Number of shapes

function setup() {
  const width = windowWidth;
  const height = windowHeight;
  createCanvas(width, height); // Creates Canvas
  background(0); // Sets initial background color
  generateRings(); // Creates rings in the ringArray
  generateShapes(); // Creates shapes in the shapeArray
}

// Draw function
function draw() {
  background(0, 5); // Continuously draw the background
  ringArray.forEach((Ring, index) => {
    Ring.createPoints(); // Creates points
    Ring.createRings(); // Creates rings
    Ring.update();
  });

  // shapeArray.forEach((Shape, index) => {
  //   Shape.drawCircle(); // Draws circles
  //   Shape.update(); // Updates objects
  // });
}

function generateRings() {
  // Stores Ring class instances in the ringArray
  for (let i = 0; i < numRings; i++) {
    ringArray.push(new Ring(windowWidth / 2, windowHeight / 2, ringSpacing, [0, 255, 255]));
  }
}

function generateShapes() {
  // Stores Shape class instances in the shapeArray
  for (let i = 0; i < numPoints; i++) {
    for (let j = 0; j < numRings; j++) {
      let angle = map(i, 0, numPoints, 0, TWO_PI);
      let xPos = ringArray[j].x;
      let yPos = ringArray[j].y;
      let radPos = ringArray[j].ringRadius;
      let x = xPos + cos(angle) * radPos;
      let y = yPos + sin(angle) * radPos;
      shapeArray.push(new Shape(x, y, radPos, 10, angle, [255, 255, 255]));
    }
  }
}

// Ring class
class Ring {
  constructor(x, y, ringRadius, ringColor) {
    this.x = x;
    this.y = y;
    this.vX = 2;
    this.vY = 2;
    this.initRadius = ringRadius; // Stores initial radius
    this.ringRadius = ringRadius;
    this.radSpeed = random(-2, 2);
    this.ringColor = ringColor;
  }

  createPoints() {
    // Creates points along the rings
    for (let i = 0; i < numPoints; i++) {
      let angle = map(i, 0, numPoints, 0, TWO_PI);
      let x = this.x + cos(angle) * this.ringRadius;
      let y = this.y + sin(angle) * this.ringRadius;
      point(x, y);
      //stroke(255, 255, 0);
    }
  }

  createRings() {
    // Creates rings
    noFill();
    ellipse(this.x, this.y, this.ringRadius * 2, this.ringRadius * 2);
    stroke(this.ringColor);
    strokeWeight(5);
  }

  update() {
    // Updates rings
    this.ringRadius += this.radSpeed;
    //this.x += this.vX;
    //this.y += this.vY;

    if (this.ringRadius >= windowWidth || this.ringRadius <= 0) {
      this.radSpeed *= -1;
    }
    if (this.y > windowHeight - 100 || this.y < 100) {
      this.vY *= -1;
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

  drawCircle() {
    // Draws circles
    fill(this.color);
    let x = windowWidth / 2 + cos(this.angle) * this.radPos + sin(this.x);
    let y = windowHeight / 2 + sin(this.angle) * this.radPos + cos(this.x);
    ellipse(x, y, this.size, this.size);
    noStroke();
  }

  update() {
    this.angle += 0.01;
  }
}

// Resize the canvas when the window is resized
function windowResized() {
  width = windowWidth;
  height = windowHeight;
  resizeCanvas(width, height);
}
