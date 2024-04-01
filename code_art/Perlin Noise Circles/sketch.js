// Dalton Kipp

var noiseArray = []; // Initializes Noise Array Variable
var colorArray = []; // Initializes Color Array Variable
let Circles = [];    // Initializes Circle Array Variable

let framerate = 60; // Capture frame rate

const noiseScale = 1;    // Sets noise scaling (increase for smoother gradient)
const detail = 8.0;      // Noise Detail
const gridScale = 20;    // Sets grid scale (increase for larger grid size)
const radScale = 20.0;   // Circle radius scale
const xScale = 0.5;      // X speed scale
const yScale = 0.5;      // Y Speed Scale
const maxDistance = 1.5; // Maximum distance scale
const alpha = 255;       // Circle transparency
const pad = 10;          // Pad with extra columns and rows

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

  console.log('Window Width =',windowWidth,'Window Height =', windowHeight)
  let p5canvas = createCanvas(windowWidth, windowHeight); // Defines Canvas Size
  canvas = p5canvas.canvas;
  background(0); // Sets Background Color
  noiseDetail(detail); // Sets Perlin Noise Detail

  const cols = windowWidth / gridScale + pad;   // Sets Number of Columns
  const rows = windowHeight / gridScale + pad;  // Sets Number of Rows
  console.log('Columns =', cols,'Rows =', rows) // Logs columns and rows to the console

  generateNoise(cols, rows);   // Generates Noise Arrays
  generateCircles(cols, rows); // Generates Circle Class Instances
}

function draw() {
  background(0)
  Circles.forEach((Circle, index) => {
    Circle.drawCircle(); // Draw circles
    Circle.update();     // Update circle position
  });
  capturer.capture(canvas)
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
    this.speedX = xScale * sin(this.x) // Random speed in X direction
    // this.speedY = 0.25*sin(this.y); // Random speed in Y direction
    this.speedY = yScale * sin(this.y); // Random speed in Y direction
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
    if (distanceX > maxDistance * gridScale || distanceY > maxDistance * gridScale) {
      this.speedX *= -1; // Reverses Direction
      this.speedY *= -1;
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
    ellipse(this.x, this.y, this.circleRadius * radScale, this.circleRadius * radScale); // Ellipse
    noStroke(); // No Outline
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
  if (noiseValue <= 80) {
    return [0, 255, 255, alpha]; // Cyan
  } else if (noiseValue <= 100) {
    return [255, 0, 0, alpha]; // Red
  } else if (noiseValue <= 120) {
    return [255, 255, 255, alpha]; // White
  } else if (noiseValue <= 140) {
    return [0, 150, 150, alpha]; // Red
  } else if (noiseValue <= 160) {
    return [0, 150, 150, alpha]; // Cyan
  } else if (noiseValue <= 180) {
    return [150, 0, 0, alpha]; // Red
  } else {
    return [150, 150, 150, alpha]; //White
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