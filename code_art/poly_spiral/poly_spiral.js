let angles = []; // Array to store rotation angles for each ring
let NUM_RINGS = 25; // Number of rings
const BACKGROUND_ALPHA = 25; // Set background refresh effect

function setup() {
  createCanvas(windowWidth, windowHeight); // Create Canvas
  angleMode(DEGREES); // Change angle mode
  noStroke(); // No stroke on all polygons

  // Initialize rotation angles for each ring
  for (let i = 0; i < NUM_RINGS; i++) {
    angles.push(0);
  }
}

function draw() {
  background(50, BACKGROUND_ALPHA); //
  translate(windowWidth / 2, windowHeight / 2);
  for (let index = 0; index < NUM_RINGS; index++) {
    getColor(index);
    let rotationDirection = index % 2 === 0 ? 1 : -1; // Alternate rotation direction
    ring(index, index * 50, 25, index * 5, 6, 0.005 * rotationDirection);
  }
}

function drawPolygon(x, y, radius, npoints) {
  let angle = 360 / npoints;
  beginShape();
  for (let a = 0; a < 360; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function ring(ringIndex, ringRadius, polyRadius, polyNum, polyVertex, rotationAngle) {
  for (let i = 0; i < polyNum; i++) {
    push(); // Initialize transformations
    rotate(angles[ringIndex]); // Use the stored rotation angle
    let angleIncrement = 360 / polyNum; // Calculate angle increment
    rotate(i * angleIncrement); // Rotate each polygon equally spaced
    drawPolygon(ringRadius, ringRadius, polyRadius, polyVertex); // Draw a polygon at each increment
    angles[ringIndex] += rotationAngle; // Update rotation angle
    pop(); // End Transfoprmations
  }
}

function getColor(index) {
  let colorIndex = index % 3; // Determine the color index based on the iteration
  let ringColor;
  if (colorIndex === 0) {
    ringColor = color(255, 50, 50); // Red
  } else if (colorIndex === 1) {
    ringColor = color(50, 255, 255); // Cyan
  } else {
    ringColor = color(255, 255, 255); // White
  }
  fill(ringColor); // Set the fill color
}

// Resize the canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resizes canvas to new window dimensions
  background(0); // Reset the background
}
