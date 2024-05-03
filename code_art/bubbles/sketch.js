var noiseArray = []; // Initializes Noise Array Variable
var colorArray = []; // Initializes Color Array Variable
let Circles = []; // Initializes Circle Array Variable

// Global Variables
const framerate = 60; // Capture frame rate
const NOISE_SCALE = 1; // Sets noise scaling (increase for smoother gradient)
const PERLIN_NOISE_DETAIL = 3.0; // Noise Detail
const GRID_SCALE = 15; // Sets grid scale (increase for larger grid size)
const RAD_SCALE = 5.0; // Circle radius scale
const X_SCALE = 0.25; // X speed scale
const Y_SCALE = 0.25; // Y Speed Scale
const MAX_DISTANCE = 10.0; // Maximum distance scale
const ALPHA = 255; // Circle transparency
const pad = 10; // Pad with extra columns and rows
var xOffset = 0; // Initial Value Of X Offset
var yOffset = 0; // Initial Value Of Y Offset

// Create CCapture object
var capturer = new CCapture({
  format: "png",
  framerate,
  name: "circles",
  quality: 100
});

function setup() {

  let p5canvas = createCanvas(windowWidth, windowHeight); // Defines Canvas Size
  canvasCapture = p5canvas.canvas;
  background(0); // Sets Background Color
  noiseDetail(PERLIN_NOISE_DETAIL); // Sets Perlin Noise Detail

  const cols = windowWidth / GRID_SCALE + pad;   // Sets Number of Columns
  const rows = windowHeight / GRID_SCALE + pad;  // Sets Number of Rows

  generateNoise(cols, rows);   // Generates Noise Arrays
  generateCircles(cols, rows); // Generates Circle Class Instances
}

function draw() {
  background(10,10,10,10)
  // translate(-windowWidth/2, -windowHeight/2)
  Circles.forEach((Circle, index) => {
    Circle.drawCircle(); // Draw circles
    Circle.update();     // Update circle position
  });
  capturer.capture(canvasCapture)
}

// Circle Class
class Circle {
  constructor(x, y, circleRadius, circleColor) {
    this.x = x;
    this.y = y;
    this.initialX = x; // Store initial position of x
    this.initialY = y; // Store initial position of y
    this.initialRad = circleRadius // Strore initial radius
    this.circleRadius = circleRadius;
    this.circleColor = circleColor;
    this.speedX = X_SCALE * random(-1,1) // Random speed in X direction
    this.speedY = Y_SCALE * random(-1,1); // Random speed in Y direction
    this.radSpeed = random(-0.1, 0.1); // Random radius size speed
  }
  
  // Update circle position
  update() {
  
    // Updates Position By Adding Speed Vector
    this.x += this.speedX
    this.y += this.speedY
    this.circleRadius += this.radSpeed;

    // Calculate Distance From Initial Position
    let distanceX = abs(this.x - this.initialX);
    let distanceY = abs(this.y - this.initialY);
    
    // Check If The Distance Is Within 10 Percent Of The GRID_SCALE
    if (distanceX > MAX_DISTANCE * GRID_SCALE || distanceY > MAX_DISTANCE * GRID_SCALE) {
      this.speedX *= -1; // Reverses Direction
      this.speedY *= -1;
    }    
    // Check If The Distance Is Within 10 Percent Of The GRID_SCALE
    if (this.circleRadius > this.initialRad * 1.5 || this.circleRadius < this.initialRad * 0.50) {
      this.radSpeed *= -1;
    }

    // // Boundary Conditions To Bounce Back The Circles
    // if (this.x < 0 || this.x > width) {
    //   this.speedX *= -1;
    // }
    // if (this.y < 0 || this.y > height) {
    //   this.speedY *= -1;
    // }
  }

  // Draw the circle
  drawCircle() {
    fill(this.circleColor); // Ellipse Fill Color
    ellipse(this.x, this.y, this.circleRadius * RAD_SCALE, this.circleRadius * RAD_SCALE); // Ellipse
    stroke(0); // No Outline
    // stroke(0);
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

  // Assigns Perlin Noise Values to noiseArray Matrix
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      noiseArray[x][y] = noise(x / NOISE_SCALE, y / NOISE_SCALE); // Calculates noise values
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
          let circleRadius = 0.5 * GRID_SCALE
          let circleColor = getColorBasedOnNoise(x, y); // Get Color Based On Noise
          Circles.push(new Circle(x * GRID_SCALE, y * GRID_SCALE, circleRadius, circleColor)); // Push New Circle
        }
      }
    }
  }
}

// Get Color Based On Noise Value
function getColorBasedOnNoise(x, y) {
  let noiseValue = colorArray[x][y];
  if (noiseValue <= 80) {
    return [0, 255, 255, ALPHA]; // Cyan
  } else if (noiseValue <= 100) {
    return [255, 0, 0, ALPHA]; // Red
  } else if (noiseValue <= 120) {
    return [255, 255, 255, ALPHA]; // White
  } else if (noiseValue <= 140) {
    return [0, 150, 150, ALPHA]; // Red
  } else if (noiseValue <= 160) {
    return [0, 150, 150, ALPHA]; // Cyan
  } else if (noiseValue <= 180) {
    return [150, 0, 0, ALPHA]; // Red
  } else {
    return [150, 150, 150, ALPHA]; //White
  }
}

function keyPressed() {
  if (key === 's' && capturer !== null) {
    capturer.stop(); // Stop capturing
    capturer.save(); // Save the captured animation
    noLoop();
    console.log('Saved Successfully')
  }
}