var noiseArray = []; // Initializes noise array variable
var colorArray = []; // Initializes color array variable

const scl = 200; // Sets noise scaling

function setup() {

  createCanvas(windowWidth, windowHeight); // Defines canvas size
  frameRate(60);
  background(0); // Sets background color
  noiseDetail(12); // Sets perlin noise detail
  
  // Creates noise matrix
  for (x = 0; x < width; x++) {
    noiseArray[x] = []; // Creates noiseArray of length x
    colorArray[x] = []; // Creates colorArray of length x
    for (y = 0; y < height; y++) {
      noiseArray[x][y] = 0; // Sets initial value of 0
      colorArray[x][y] = 0; // Sets initial value of 0
    }
  }
  
  // Assigns perlin noise values to noiseArray matrix
  for (x = 0; x < width; x++) {
    for (y = 0; y < height; y++) {
      noiseArray[x][y] = noise(x / scl + 10000, y / scl + 10000); // 
      colorArray[x][y] = map(noiseArray[x][y], 0, 1, 0, 100)
    }
  }

  drawNoise(); // Calls draw() function
  drawCircles();
}

// Sets pixel colors
function drawNoise() {
  for (x = 0; x < width; x++) {
    for (y = 0; y < height; y++) {
      if (5 < colorArray[x][y] && colorArray[x][y] < 10) {
        set(x,y,color(0, 255, 255)) // Cyan
      }
      else if (15 < colorArray[x][y] && colorArray[x][y] < 20) {
        set(x,y,color(255, 0, 0)) // Red
      }
      else if (25 < colorArray[x][y] && colorArray[x][y] < 30) {
        set(x,y,color(255, 255, 255)) // White
      }
      else if (35 < colorArray[x][y] && colorArray[x][y] < 40) {
        set(x, y, color(0, 255, 255)) // Cyan
      }
      else if (45 < colorArray[x][y] && colorArray[x][y] < 50) {
        set(x ,y, color(255, 0, 0)) // Red
      }
      else if (55 < colorArray[x][y] && colorArray[x][y] < 60) {
        set(x,y,color(255, 255, 255)) // White
      }
      else {
        set(x, y, color(0, 0, 0)); // Black
      }
    }
  }
  updatePixels(); // Renders Pixels
}

function drawCircles() {
  
  const backgroundAlpha = 255;
  
  // Number of concentric circles
  let numCircles = 400;
  
  // Center of the canvas
  let centerX = width / 2;
  let centerY = height / 2;

  // Calculate the maximum radius to reach the edges
  let maxRadius = sqrt(2)*Math.max(centerX, centerY);

  // Draw concentric circles with alpha variation
  for (let i = 0; i < numCircles; i++) {
    let circleRadius = i * (maxRadius / numCircles); // Adjust the spacing

    // Use sine function for alpha variation
    let alpha = 255 + backgroundAlpha * sin(frameCount * 0.1 - i * 0.1);
    
    // Set color with alpha
    stroke(0, 0, 0); // Red with varying alpha
    
    // Set thickness of the stroke
    let thickness = 1; // Adjust the thickness range
    strokeWeight(thickness);
    
    noFill();

    // Draw the circle
    ellipse(centerX, centerY, circleRadius * 2, circleRadius * 2);
  }
}