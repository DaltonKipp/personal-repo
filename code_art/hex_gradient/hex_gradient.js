let RADIUS = 10; // Sets hexagon radius
let SIDE_LENGTH = Math.sqrt((3 * Math.pow(RADIUS, 2)) / 4); // Calculates Side length
let hexagons = [];
let canvasWidth, canvasHeight;

function setup() {
  canvasWidth = windowWidth; // Sets canvas width
  canvasHeight = windowHeight; // Sets canvas height
  colorMode(RGB); // Defines color mode
  createCanvas(canvasWidth, canvasHeight); // Creates canvas
  generateHexagons(); // Populates Hexagon array
  noiseDetail(3); // Sets perlin noise detail value
  frameRate(60);
}

// Draws Hexagon
function draw() {
  background(0);
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
    // Calculates ratio of dictance from center & max distance
    this.colorFactor = this.distanceFromCenter / this.maxDistance;
  }

  // Renders Hexagon
  color() {
    // Calculate color based on precomputed values
    let noiseValue = noise(
      this.x + this.noiseOffset,
      this.y + this.noiseOffset
    );
    var RED = 500 * noiseValue * (1 - this.colorFactor);
    var GREEN = 500 * noiseValue * (1 - this.colorFactor);
    var BLUE = 500 * noiseValue * (1 - this.colorFactor);

    // Sets the Fill of the Hexagons
    if (this.colorFactor >= 0.0 && this.colorFactor < 0.2) {
      fill(RED, 25, 0);
    } else if (this.colorFactor >= 0.2 && this.colorFactor < 0.25) {
      fill(RED - 50, 0, 0); // Slightly darker
    } else if (this.colorFactor >= 0.25 && this.colorFactor <= 0.3) {
      fill(RED - 100, 0, 0); // Slightly darker
    } else {
      fill(RED - 25);
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
    this.noiseOffset += 0.01;
  }
}

function generateHexagons() {
  // Create hexagon grid
  for (let y = 0; y < windowHeight + SIDE_LENGTH; y += 2 * SIDE_LENGTH) {
    for (let x = 0; x < windowWidth + RADIUS; x += 3 * RADIUS) {
      // Creates first row of hexagons
      hexagons.push(new Hexagon(x, y, RADIUS));
      // Creates second row of hexagons with offset
      hexagons.push(new Hexagon(x + 1.5 * RADIUS, y + SIDE_LENGTH, RADIUS));
    }
  }
}
