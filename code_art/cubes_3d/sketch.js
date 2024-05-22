let speed = 0;
let boxSize = 50;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  // rotateX(45);
}

function draw() {
  background(50);
  speed += 0.5;
  rotateX(speed);
  rotateY(speed);
  let halfGrid = 5 * boxSize;
  for (let i = -halfGrid; i < halfGrid; i += boxSize) {
    for (let j = -halfGrid; j < halfGrid; j += boxSize) {
      push();
      translate(i, j, 0);
      fill(i, i, i);
      box(boxSize, boxSize, random(0, 100));
      pop();
    }
  }
}
