const SPIRAL_SCALE = 3; // Adjust this value to control the scale of the spiral
const ANGLE_SCALE = 800;
const RAD_SCALE = 50;
const DIST_SCALE = 50;
const BACKGROUND_ALPHA = 5.0; // Acts like a blur/refres rate
const PHI = (1 + Math.sqrt(5)) / 2; // Global calulation of PHI
const nth = 3000; // nth degree of the drawSpiral iterations
let polySides = 6; // Set default number of polygon sides

var GLOBAL_ROTATION_ANGLE = 0; // Add a global variable for the overall rotation
var POLYGON_ROTATION_ANGLE = 0; // Add a global variable for the polygon rotation

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  background(0, BACKGROUND_ALPHA); // Refresh Background
  translate(windowWidth / 2, windowHeight / 2); // Move origin to center of canvas
  rotate(GLOBAL_ROTATION_ANGLE); // Apply the global rotation to the canvas
  drawSpiral();

  GLOBAL_ROTATION_ANGLE += 0.15; // Increment the global rotation angle
  POLYGON_ROTATION_ANGLE += 1.0; // Increment the polygon rotation angle
}

function drawSpiral() {
  for (let i = 1; i < nth; i++) {
    var f = (i * SPIRAL_SCALE) / nth;
    var angle = i * ANGLE_SCALE * PHI;
    var radius = f * RAD_SCALE;
    var distance = f * radius;

    var x = DIST_SCALE * cos(angle * TWO_PI) * distance;
    var y = DIST_SCALE * sin(angle * TWO_PI) * distance;

    // Set the number of polygon sides based on the index
    if (i % 2 == 0) {
      polySides = 3;
    } else if (i % 3 == 0) {
      polySides = 4;
    } else {
      polySides = 6;
    }

    // Calculate the distance from the center of the canvas
    var distFromCenter = dist(0, 0, x, y);
    // Map the distance to a color range
    var maxDist = dist(0, 0, width / 2, height / 2); // Calculates maximum distance
    var colorValue = map(distFromCenter, 0, maxDist, 0, 1); // Calculates colorValue
    var col; // Initializes color variable

    // Map colors based on the distance from the center
    if (colorValue <= 0.5) {
      // Black to Red
      let t = map(colorValue, 0, 0.33, 0, 1);
      col = lerpColor(color(0, 0, 0), color(100, 100, 100), t);
    } else if (colorValue <= 0.75) {
      // Red to Cyan
      let t = map(colorValue, 0.33, 0.66, 0, 1);
      col = lerpColor(color(100, 100, 100), color(155, 155, 155), t);
    } else {
      // Cyan to White
      let t = map(colorValue, 0.66, 1, 0, 1);
      col = lerpColor(color(155, 155, 155), color(255, 255, 255), t);
    }

    fill(col);
    drawPolygon(x, y, radius, polySides, POLYGON_ROTATION_ANGLE + i); // Pass the rotation angle to drawPolygon
  }
}

function drawPolygon(x, y, radius, nPoints, rotationAngle) {
  let angle = 360 / nPoints;
  push(); // Initialize transformations
  translate(x, y); // Translate to given x y position
  rotate(rotationAngle); // Apply individual polygon rotation
  beginShape(); // Initialize shape
  for (let a = 0; a < 360; a += angle) {
    let sx = cos(a) * radius;
    let sy = sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE); // End shape
  pop(); // Store transformations
  noStroke(); //
}

// Resize the canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resizes canvas to new window dimensions
  background(0); // Reset the background
}
