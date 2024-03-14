var cols, rows; // Initializes rows and column variables
let scale = 100; // Sets scale of the mesh
var zArray = []; // Initializies Z Value array
var colorArray = []; // Initializes Color array
var mapRange = []; // Initializes Map Range (Noise and Color)
var speed = 0; // Initializes movement speed variable

// Sets up canvas and arrays
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // 3D WEBGL
  background(0); // Black background
  frameRate(60); // Sets frame rate
  cols = (1.25 * width) / scale; // Calculates column delta
  rows = (1.25 * height) / scale; // Calculates row delta

  for (var x = 0; x < cols; x++) { // For every row
    zArray[x] = []; // Creates array of x length
    colorArray[x] = []; // Creates array of x length
    for (var y = 0; y < rows; y++) { // For every column
      zArray[x][y] = 0; // Sets a value of zero for every place
      colorArray[x][y] = 0; // Sets a value of zero for every place
    }
  }
}

function draw() {
  speed += 0.005; // Increments speed
  var yOffset = speed; // Updates yOffset (moving forward)
  for (y = 0; y < rows; y++) { // For every row
    var xOffset = speed; // Updates xOffset (moving right)
    for (x = 0; x < cols; x++) { // For every column
      
      // Maps a z noise value for every vertex
      zArray[x][y] = map(noise(xOffset, yOffset), 0, 1, -150, 150);
      
      // Maps a color value for every vertex
      colorArray[x][y] = map(zArray[x][y], -150, 150, 0, 360);
      
      xOffset += 0.4; // Increments xOffset (noise difference)
    }
    yOffset += 0.4; // Increments yOffset (noise difference)
  }

  translate(-width/1.5, -height / 2); // Translates to top left from center
  rotateX(PI/ 6+0.1*speed); // Rotates along x axis
  translate(0, -height / 4); // Translates down (z axis)
  rotateY(0.1*speed)
  for (y = 0; y < rows - 1; y++) { // For every row
    beginShape(TRIANGLE_STRIP); // Initiates shape
    for (x = 0; x < cols; x++) { // For every column
      // Creates first vertex
      vertex(x * scale, y * scale, zArray[x][y]);
      // Next vertex (one row below)
      vertex(x * scale, (y + 1) * scale, zArray[x][y + 1]);
      // Sets line color based on z value
      stroke(colorArray[x][y], 0, 360, HSB);
      // Sets line thickness
      strokeWeight(5);
    }
    fill(20); // Fill shape
    endShape(); // Close shape
  }
}
