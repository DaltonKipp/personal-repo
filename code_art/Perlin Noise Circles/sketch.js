var noiseArray = []; // Initializes noise array variable
var colorArray = []; // Initializes color array variable
let Circles = []; // Initializes Circle array variable

const noiseScale = 100; // Sets noise scaling (increase for smoother gradient)
var gridScale = 20; // Sets grid sclae (inscrease for larger grid size)

var xOffset = 0; // Initial Value of x offset
var yOffset = 0; // Initial value of y offset

function setup() {
  size = min(windowHeight,windowWidth)
  createCanvas(windowWidth, windowHeight); // Defines canvas size
  background(0); // Sets background color
  noiseDetail(3); // Sets perlin noise detail

  const cols = windowWidth / gridScale; // Sets number of columns
  print(cols) // Prints columns constant to console
  const rows = windowHeight / gridScale; // Sets number of rows
  print(rows) // Prints rows constant to console

  generateNoise(cols, rows); // Generates noise arrays
  print(noiseArray) // Prints noise array to console
  print(colorArray) // Prints color array to console
  generateCircles(cols, rows); // Generates circle class instances

  Circles.forEach((Circle, index) => { // For every instance of the circle class
    Circle.drawCircle(); // Draws circles from circle class
  })
  noLoop();
}

// Circle Class
class Circle {
  constructor(x, y, circleRadius, circleColor) {
    this.x = x;
    this.y = y;
    this.circleRadius = circleRadius;
    this.circleColor = circleColor;
  }
  // Draw the circle
  drawCircle() {
    fill(this.circleColor) // Ellipse Fill Color
    ellipse(this.x, this.y, this.circleRadius*2, this.circleRadius*2); // Ellipse
    noStroke(); // No Outline
  }
}

//
function generateNoise(cols, rows) {
  // Creates noise matrix
  for (x = 0; x < cols; x++) {
    noiseArray[x] = []; // Creates noiseArray of length x
    colorArray[x] = []; // Creates colorArray of length x
    for (y = 0; y < rows; y++) {
      noiseArray[x][y] = 0; // Sets initial value of 0
      colorArray[x][y] = 0; // Sets initial value of 0
    }
  }
  
  // Assigns perlin noise values to noiseArray matrix
  for (x = 0; x < cols; x++) {
    for (y = 0; y < rows; y++) {
      noiseArray[x][y] = noise(x / noiseScale, y / noiseScale); // Calculates noise values
      colorArray[x][y] = map(noiseArray[x][y], 0, 1, 0, 255) // Maps noise values between 0 and 255
    }
  }

  return noiseArray, colorArray;
}

// Generate Circles
function generateCircles(cols,rows) {
  
  for (var x = 0; x < cols-1; x++) { // For every column
    if (x % 2 != 0) { // For every odd number

      for (var y = 0; y < rows-1; y++) { // For every row
        if (y % 2 != 0) { // For every odd number

          if (colorArray[x][y] <= 80) {
            Circles.push(new Circle(x*gridScale, y*gridScale, gridScale, [0, 0, random(0,255)]))
          }
          
          else if (colorArray[x][y] <= 160) {
            Circles.push(new Circle(x*gridScale, y*gridScale, gridScale, [0, random(0,255), 0]))
          }

          else if (colorArray[x][y] <= 240) {
            Circles.push(new Circle(x*gridScale, y*gridScale, gridScale, [0, 0, random(0,255)]))
          }
          else {
            Circles.push(new Circle(x*gridScale, y*gridScale, gridScale, colorArray[x][y]))
          }
        }
      }
    }
  }
}