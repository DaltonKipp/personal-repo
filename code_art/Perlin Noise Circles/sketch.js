var noiseArray = []; // Initializes Noise Array Variable
var colorArray = []; // Initializes Color Array Variable
let Circles = []; // Initializes Circle Array Variable
let truth = true;

const noiseScale = 50; // Sets noise scaling (increase for smoother gradient)
var gridScale = 10; // Sets grid scale (increase for larger grid size)

var xOffset = 0; // Initial Value Of X Offset
var yOffset = 0; // Initial Value Of Y Offset

function setup() {
  size = min(windowHeight, windowWidth);
  createCanvas(windowWidth, windowHeight); // Defines Canvas Size
  background(0); // Sets Background Color
  noiseDetail(8); // Sets Perlin Noise Detail

  const cols = windowWidth / gridScale; // Sets Number of Columns
  const rows = windowHeight / gridScale; // Sets Number of Rows

  generateNoise(cols, rows); // Generates Noise Arrays
  generateCircles(cols, rows); // Generates Circle Class Instances
}

function draw() {
  background(0); // Clear background

  Circles.forEach((Circle, index) => {
    Circle.drawCircle(); // Draw circles
    Circle.update(); // Update circle position
  });
}

// Circle Class
class Circle {
  constructor(x, y, circleRadius, circleColor) {
    this.x = x;
    this.y = y;
    this.initialX = x; // Store initial position of x
    this.initialY = y; // Store initial position of y
    this.circleRadius = circleRadius;
    this.circleColor = circleColor;
    // this.speedX = 0.25*sin(this.x); // Random speed in X direction
    this.speedX = random(-0.25, 0.25); // Random speed in X direction
    // this.speedY = 0.25*sin(this.y); // Random speed in Y direction
    this.speedY = random(-0.25, 0.25); // Random speed in Y direction
  }
  
  // Update circle position
  update() {
  
    // Updates Position By Adding Speed Vector
    this.x += this.speedX
    this.y += this.speedY

    // Calculate Distance From Initial Position
    let distanceX = abs(this.x - this.initialX);
    let distanceY = abs(this.y - this.initialY);
    
    // Check If The Distance Is Within 10 Percent Of The gridScale
    if (distanceX > 0.5 * gridScale || distanceY > 0.5 * gridScale) {
      this.speedX *= -1;
      this.speedY *= -1;
    }
    
    // Boundary Conditions To Bounce Back The Circles
    if (this.x < 0 || this.x > width) {
      this.speedX *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.speedY *= -1;
    }
  }

  // Draw the circle
  drawCircle() {
    fill(this.circleColor); // Ellipse Fill Color
    ellipse(this.x, this.y, this.circleRadius * 1.5, this.circleRadius * 1.5); // Ellipse
    stroke(0); // No Outline
  }
}

// Generate Noise
function generateNoise(cols, rows) {
  // Creates noise matrix
  for (let x = 0; x < cols; x++) {
    noiseArray[x] = []; // Creates noiseArray of length x
    colorArray[x] = []; // Creates colorArray of length x
    for (let y = 0; y < rows; y++) {
      noiseArray[x][y] = 0; // Sets initial value of 0
      colorArray[x][y] = 0; // Sets initial value of 0
    }
  }

  // Assigns perlin noise values to noiseArray matrix
  for (let x = 0; x < cols; x++) {
    xOffset += 0.1;
    for (let y = 0; y < rows; y++) {
      yOffset += 0.1;
      noiseArray[x][y] = noise(x / noiseScale, y / noiseScale); // Calculates noise values
      colorArray[x][y] = map(noiseArray[x][y], 0, 1, 0, 255); // Maps noise values between 0 and 255
    }
  }
}

// Generate Circles
function generateCircles(cols, rows) {
  for (let x = 0; x < cols - 1; x++) { // For Every Column
    if (x % 2 != 0) { // For Every Odd Number
      for (let y = 0; y < rows - 1; y++) { // For Every Row
        if (y % 2 != 0) { // For Every Odd Number
          let circleRadius = 0.5 * gridScale
          let circleColor = getColorBasedOnNoise(x, y); // Get Color Based On Noise
          Circles.push(new Circle(x * gridScale, y * gridScale, circleRadius, circleColor)); // Push New Circle
        }
      }
    }
  }
}

// Get Color Based On Noise Value
function getColorBasedOnNoise(x, y) {
  let noiseValue = colorArray[x][y];
  if (noiseValue <= 100) {
    return [0, 255, 255]; // Cyan
  } else if (noiseValue <= 120) {
    return [255, 0, 0]; // Red
  } else if (noiseValue <= 140) {
    return [0, 200, 200]; // Cyan
  } else if (noiseValue <= 160) {
    return [200, 0, 0]; // Red
  } else if (noiseValue <= 180) {
    return [0, 100, 100];
  } else if (noiseValue <= 200) {
    return [100, 0, 0];
  } else {
    return [10, 10, 10];
  }
}
