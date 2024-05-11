const SPIRAL_SCALE = 2; // Adjust this value to control the scale of the spiral
const ANGLE_SCALE = 100;
const RAD_SCALE = 50;
const DIST_SCALE = 50;
const PHI = (1 + Math.sqrt(5)) / 2;
const nth = 8000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
}

function draw() {
  background(0);
  translate(width / 2, height / 2); // Move origin to center of canvas
  // noStroke()
  fill(255)
  rotate(100)

  drawSpiral();
}

function drawSpiral() {
  for (i=1; i < nth; i++) {
    let f = i * SPIRAL_SCALE / nth;
    let angle = i * ANGLE_SCALE * PHI;
    let radius = f * RAD_SCALE;
    let distance = f * radius;

    let x = DIST_SCALE * cos(angle * TWO_PI) * distance;
    let y = DIST_SCALE * sin(angle * TWO_PI) * distance;
    drawPolygon(x, y, radius, 6)
    rotate(0.1)
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

