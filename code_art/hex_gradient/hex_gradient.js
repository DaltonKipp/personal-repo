let RADIUS = 10; // Sets hexagon radius
let SIDE_LENGTH = Math.sqrt((3 * Math.pow(RADIUS, 2)) / 4);
let hexagons = [];

function setup() {
	canvasWidth = windowWidth;
	canvasHeight = windowHeight;
	colorMode(RGBA) // Defines color mode
	createCanvas(canvasWidth, canvasHeight); // Creates canvas
	generateHexagons();
}

// Draws Hexagon
function draw() {
	background(0);
	hexagons.forEach((hexagon) => {
		hexagon.color();
		hexagon.drawPolygon(6);
	});
	noLoop();
}

// Hexagon Class
class Hexagon {
	constructor(x, y, r) {
		// Sets up x position, y position, radius
		this.x = x;
		this.y = y;
		this.r = r;
		this.distanceFromCenter = dist(x, y, canvasWidth / 2, canvasHeight / 2);
	}
	
  // Renders Hexagon
	color() {
		// Calculate color based on distance from center
		let maxDistance = dist(0, 0, canvasWidth / 2, canvasHeight / 2);
		let colorFactor = this.distanceFromCenter / maxDistance;
		
		let RED = 255 * noise(this.x, this.y);
		let GREEN = 255 * noise(this.x, this.y);
		let BLUE = 255 * noise(this.x, this.y);

		// Sets the Fill of the Hexagons
		if (this.distanceFromCenter < canvasWidth / 4) {
			fill(RED, 0, 0);
		}
		else if (this.distanceFromCenter < canvasWidth / 3) {
			fill(0, GREEN, 0);
		}
		else if (this.distanceFromCenter < canvasWidth / 2.5) {
			fill(0, 0, BLUE);
		}		else {
			fill(RED, GREEN, BLUE, 255);
		}
		
		// Sets the Stroke of the Hexagons
		stroke(0);
		strokeWeight(1);
	}

	drawPolygon(numSides) {
		beginShape();
		for (let a = 0; a < 2 * PI; a += (2 * PI) / numSides) {
			let x2 = cos(a) * this.r;
			let y2 = sin(a) * this.r;
			vertex(this.x + x2, this.y + y2);
		}
		endShape(CLOSE);
	}
}

function generateHexagons() {
	// create hexagons
	for (let y = 0; y < canvasHeight + SIDE_LENGTH; y += 2 * SIDE_LENGTH) {
		for (let x = 0; x < canvasWidth + RADIUS; x += 3 * RADIUS) {
			// Creates first row of hexagons
			hexagons.push(new Hexagon(x, y, RADIUS));
			// Creates second row of hexagons with offset
			hexagons.push(new Hexagon(x + 1.5 * RADIUS, y + SIDE_LENGTH, RADIUS));
		}
	}
	console.log('Hexagon Array:', hexagons);
}
