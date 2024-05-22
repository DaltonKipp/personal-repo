let speed = 0;
let gridSize = 4;
let cubeSize = 100;
let cubes = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  rotateX(30);
  // Create a grid of Cube objects
  let halfGrid = gridSize / 2;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let xPos = (i - halfGrid) * cubeSize;
      let yPos = (j - halfGrid) * cubeSize;
      let zPos = (i - halfGrid) * cubeSize;
      cubes.push(new Cube(xPos, yPos, 0, cubeSize, cubeSize, random(0, 400)));
    }
  }
}

function draw() {
  background(50);
  speed += 0.5;
  // rotateX(speed);
  rotateY(speed);

  // Draw each cube in the grid
  for (let cube of cubes) {
    cube.draw();
  }
}

class Cube {
  constructor(x, y, z, w, h, d) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.h = h;
    this.d = d;
  }

  draw() {
    push();
    translate(this.x, this.y, this.z);

    // Front face
    beginShape();
    fill(255, 0, 0);
    vertex(-this.w / 2, -this.h / 2, -this.d / 2);
    vertex(this.w / 2, -this.h / 2, -this.d / 2);
    vertex(this.w / 2, this.h / 2, -this.d / 2);
    vertex(-this.w / 2, this.h / 2, -this.d / 2);
    endShape(CLOSE);

    // Back face
    beginShape();
    fill(155, 0, 0);
    vertex(-this.w / 2, -this.h / 2, this.d / 2);
    vertex(this.w / 2, -this.h / 2, this.d / 2);
    vertex(this.w / 2, this.h / 2, this.d / 2);
    vertex(-this.w / 2, this.h / 2, this.d / 2);
    endShape(CLOSE);

    // Top face
    beginShape();
    fill(255, 0, 255);
    vertex(-this.w / 2, -this.h / 2, -this.d / 2);
    vertex(this.w / 2, -this.h / 2, -this.d / 2);
    vertex(this.w / 2, -this.h / 2, this.d / 2);
    vertex(-this.w / 2, -this.h / 2, this.d / 2);
    endShape(CLOSE);

    // Bottom face
    beginShape();
    fill(0, 255, 255);
    vertex(-this.w / 2, this.h / 2, -this.d / 2);
    vertex(this.w / 2, this.h / 2, -this.d / 2);
    vertex(this.w / 2, this.h / 2, this.d / 2);
    vertex(-this.w / 2, this.h / 2, this.d / 2);
    endShape(CLOSE);

    // Right face
    beginShape();
    fill(255, 150, 0);
    vertex(this.w / 2, -this.h / 2, -this.d / 2);
    vertex(this.w / 2, this.h / 2, -this.d / 2);
    vertex(this.w / 2, this.h / 2, this.d / 2);
    vertex(this.w / 2, -this.h / 2, this.d / 2);
    endShape(CLOSE);

    // Left face
    beginShape();
    fill(255, 255, 0);
    vertex(-this.w / 2, -this.h / 2, -this.d / 2);
    vertex(-this.w / 2, this.h / 2, -this.d / 2);
    vertex(-this.w / 2, this.h / 2, this.d / 2);
    vertex(-this.w / 2, -this.h / 2, this.d / 2);
    endShape(CLOSE);

    pop();
  }

  // Method to update dimensions
  updateDimensions(newW, newH, newD) {
    this.w = newW;
    this.h = newH;
    this.d = newD;
  }
}

// Example usage: Update dimensions of a specific cube
function mousePressed() {
  if (cubes.length > 0) {
    cubes[0].updateDimensions(150, 150, 150); // Update the first cube
  }
}
