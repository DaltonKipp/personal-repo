var iterations = 1;
var spacing = 1;

var iterSpeed = 1;
var spacingSpeed = 0.1;
var rotationSpeed = 0.5; // Rotation speed in degrees
var angle = 0; // Initial rotation angle

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  frameRate(120);
}

function draw() {
  background(0, 25);
  translate(windowWidth / 2, windowHeight / 2);
  rotate(angle); // Rotate the entire coordinate system

  for (i = 0; i < floor(iterations); i++) {
    push();
    stroke(255, 255, 255);
    strokeWeight(2);
    // Left
    let x1 = i;
    let y1 = (10 * windowHeight) / i;
    let x2 = spacing * i;
    let y2 = 0;
    line(x1, y1, x2, y2);
    line(x2, y2, -x1, -y1);
    // Right
    line(-x1, -y1, -x2, -y2);
    line(-x2, -y2, x1, y1);
    pop();
  }

  iterations += iterSpeed;
  spacing += spacingSpeed;

  if (iterations >= 1000 || iterations <= 1) {
    iterSpeed *= -1;
  }
  if (spacing >= 100 || spacing <= 1) {
    spacingSpeed *= -1;
  }

  angle += rotationSpeed; // Update the rotation angle

  gridlines();
}

function gridlines() {
  stroke(255, 255, 255);
  strokeWeight(10);
  length = Math.sqrt(windowWidth ** 2 + windowHeight ** 2);
  line(0, 0, length, length);
  line(0, 0, length, -length);
  line(0, 0, -length, length);
  line(0, 0, -length, -length);
  line(-length, 0, length, 0);
  line(0, -length, 0, length);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
