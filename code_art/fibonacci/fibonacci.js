const SPIRAL_SCALE = 2; // Adjust this value to control the scale of the spiral
const ANGLE_SCALE = 800;
const RAD_SCALE = 50;
const DIST_SCALE = 50;
const BACKGROUND_ALPHA = 5.0; // Acts like a blur/refres rate
const PHI = (1 + Math.sqrt(5)) / 2; // Global calulation of PHI
const nth = 4000; // nth degree of the drawSpiral iterations
let polySides = 6; // Set default number of polygon sides

let globalRotationAngle = 0; // Add a global variable for the overall rotation
let polygonRotationAngle = 0; // Add a global variable for the polygon rotation

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  background(0, BACKGROUND_ALPHA); // Refresh Background
  translate(windowWidth / 2, windowHeight / 2); // Move origin to center of canvas
  rotate(globalRotationAngle); // Apply the global rotation
  noStroke();
  drawSpiral();

  globalRotationAngle += 0.1; // Increment the global rotation angle
  polygonRotationAngle += 1; // Increment the polygon rotation angle
}

function drawSpiral() {
  for (let i = 1; i < nth; i++) {
    let f = i * SPIRAL_SCALE / nth;
    let angle = i * ANGLE_SCALE * PHI;
    let radius = f * RAD_SCALE;
    let distance = f * radius;

    let x = DIST_SCALE * cos(angle * TWO_PI) * distance;
    let y = DIST_SCALE * sin(angle * TWO_PI) * distance;

    // Set the number of polygon sides based on the index
    if (i % 2 == 0) {
      polySides = 3;
    } else if (i % 3 == 0) {
      polySides = 4;
    } else {
      polySides = 6;
    }

    // Calculate the distance from the center of the canvas
    let distFromCenter = dist(0, 0, x, y);
    // Map the distance to a color range
    let maxDist = dist(0, 0, width / 2, height / 2);
    let colorValue = map(distFromCenter, 0, maxDist, 0, 1);
    let col;

    if (colorValue < 0.5) {
      // Red to Cyan
      let t = map(colorValue, 0, 0.5, 0, 1);
      col = lerpColor(color(155, 0, 0), color(0, 255, 255), t);
    } else {
      // Cyan to White
      let t = map(colorValue, 0.5, 1, 0, 1);
      col = lerpColor(color(0, 255, 255), color(255, 255, 255), t);
    }

    fill(col);
    drawPolygon(x, y, radius, polySides, polygonRotationAngle + i); // Pass the rotation angle to drawPolygon
  }
}

function drawPolygon(x, y, radius, nPoints, rotationAngle) {
  let angle = 360 / nPoints;
  push();
  translate(x, y);
  rotate(rotationAngle); // Apply individual polygon rotation
  beginShape();
  for (let a = 0; a < 360; a += angle) {
    let sx = cos(a) * radius;
    let sy = sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
  pop();
}
