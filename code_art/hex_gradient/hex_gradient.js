let RADIUS = 15; // Sets hexagon radius
let SIDE_LENGTH = Math.sqrt((3 * Math.pow(RADIUS, 2)) / 4); // Calculates Side length
let hexagons = []; // Initializes hexagon class instance array
let canvasWidth, canvasHeight; // Sets global canvas variables
const NOISE_SCALE = 50; // Sets scale of perlin noise

function setup() {
  canvasWidth = windowWidth; // Sets canvas width
  canvasHeight = windowHeight; // Sets canvas height
  colorMode(RGB); // Defines color mode
  createCanvas(canvasWidth, canvasHeight); // Creates canvas
  noiseDetail(4); // Sets perlin noise detail value
  generateHexagons(); // Populates Hexagon array
  frameRate(60);
}

// Draws Hexagon
function draw() {
  background(0); // Clear previous frame
  hexagons.forEach((hexagon) => {
    hexagon.color(); // Gets hexagon color
    hexagon.drawPolygon(6); // Draws hexagons
    hexagon.update(); // Updates hexagon parameters
  });
}

// Hexagon Class
class Hexagon {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.noiseOffset = 0;
    this.delta = 1;
    // Calculates distance from the polygon to the middle of the canvas
    this.distanceFromCenter = dist(x, y, canvasWidth / 2, canvasHeight / 2);
    // Calculates maximum distance value
    this.maxDistance = dist(0, 0, canvasWidth / 2, canvasHeight / 2);
    // Calculates ratio of distance from center & max distance
    this.colorFactor = this.distanceFromCenter / this.maxDistance;
  }

  // Renders Hexagon
  color() {
    // Calculate color based on precomputed values
    let noiseValue = noise(
      this.x / NOISE_SCALE + this.noiseOffset,
      this.y / NOISE_SCALE + this.noiseOffset
    );
    var RED = 500 * Math.sin(noiseValue) * (1 - this.colorFactor);
    var GREEN = 500 * noiseValue * (1 - this.colorFactor);
    var BLUE = 500 * noiseValue * (1 - this.colorFactor);

    // Sets the Fill of the Hexagons
    if (this.colorFactor >= 0.0 && this.colorFactor < 0.2) {
      fill(RED, 0, 0);
    } else if (this.colorFactor >= 0.2 && this.colorFactor < 0.25) {
      fill(RED * 0.5, 0, 0); // Slightly darker
    } else if (this.colorFactor >= 0.25 && this.colorFactor <= 0.3) {
      fill(RED * 0.25, 0, 0); // Slightly darker
    } else {
      fill(RED - 50);
    }
  }

  drawPolygon(numSides) {
    var angleIncrement = (2 * Math.PI) / numSides;
    beginShape();
    for (let a = 0; a < 2 * Math.PI; a += angleIncrement) {
      let x2 = Math.cos(a) * this.r;
      let y2 = Math.sin(a) * this.r;
      vertex(this.x + x2, this.y + y2);
    }
    endShape(CLOSE);

    // Sets the Stroke of the Hexagons
    stroke(0);
    strokeWeight(2);
  }

  update() {
    this.noiseOffset += 0.025;
  }
}

function generateHexagons() {
  // Create hexagon grid
  SIDE_LENGTH = Math.sqrt((3 * Math.pow(RADIUS, 2)) / 4); // Recalculate SIDE_LENGTH
  for (let y = 0; y < windowHeight + SIDE_LENGTH; y += 2 * SIDE_LENGTH) {
    for (let x = 0; x < windowWidth + RADIUS; x += 3 * RADIUS) {
      // Creates first row of hexagons
      hexagons.push(new Hexagon(x, y, RADIUS));
      // Creates second row of hexagons with offset
      hexagons.push(new Hexagon(x + 1.5 * RADIUS, y + SIDE_LENGTH, RADIUS));
    }
  }
}

// Resize the canvas when the window is resized
function windowResized() {
  canvasWidth = windowWidth; // Update canvas width
  canvasHeight = windowHeight; // Update canvas height
  resizeCanvas(canvasWidth, canvasHeight); // Resizes canvas to new window dimensions
  hexagons = [];
  generateHexagons();
}
