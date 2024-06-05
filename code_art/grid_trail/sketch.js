// CONSTANTS
const CELL_SIZE = 50; // size of each cell in the grid
const COLOR_R = 55;
const COLOR_G = 55;
const COLOR_B = 55;
const STROKE_WEIGHT = 2;
const STARTING_ALPHA = 255;
const BACKGROUND_COLOR = 0;
const BACKGROUND_ALPHA = 20;
const PROB_OF_NEIGHBOR = 0.2;
const AMT_FADE_PER_FRAME = 10;
const NUM_OF_NEIGHBORS = 10;
const MOVEMENT_SPEED = 0.01;
const SHAKE = 0.02;

// VARIABLES
let colorWithAlpha;
let numRows;
let numCols;
let currentRow = -1;
let currentCol = -1;
let allNeighbors = []; // Array to store all neighbors
let angle = 0; // Initial starting angle
let showFPS = true; // Variable to toggle FPS display
let fpsUpdateInterval = 10; // FPS update interval
let frameCounter = 0; // Counter to keep track of frames
let currentFPS = 0; // Initial FPS count

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  background(0)
  angleMode(DEGREES)
  colorWithAlpha = color(COLOR_R, COLOR_G, COLOR_B, STARTING_ALPHA);
  noFill();
  stroke(colorWithAlpha);
  strokeWeight(STROKE_WEIGHT);
  numRows = Math.ceil(windowHeight / CELL_SIZE); // number of rows in the grid
  numCols = Math.ceil(windowWidth / CELL_SIZE); // number of columns in the grid
}

function draw() {
  background(BACKGROUND_COLOR, BACKGROUND_ALPHA);

  // Calculate the row and column of the cell that the mouse is currently over
  let row = floor(getPosition().yPosition / CELL_SIZE);
  let col = floor(getPosition().xPosition / CELL_SIZE);

  // Check if the mouse has moved to a different cell
  if (row !== currentRow || col !== currentCol) {
    currentRow = row;
    currentCol = col;
    // Add new neighbors to the allNeighbors array
    allNeighbors.push(...getRandomNeighbors(row, col));
  }

  // Use the calculated row and column to determine the position of the cell
  let x = col * CELL_SIZE;
  let y = row * CELL_SIZE;

  // Draw a highlighted rectangle over the cell under the mouse cursor
  // stroke(colorWithAlpha);
  // rect(x, y, CELL_SIZE, CELL_SIZE);

  // Draw and update all neighbors
  for (let neighbor of allNeighbors) {
    let neighborX = neighbor.col * CELL_SIZE;
    let neighborY = neighbor.row * CELL_SIZE;

    // Update the opacity of the neighbor
    neighbor.opacity = max(0, neighbor.opacity - AMT_FADE_PER_FRAME); // Decrease opacity by 5 each frame
    neighbor.color = max(0, neighbor.color - AMT_FADE_PER_FRAME); // Decrease opacity by 5 each frame
    neighbor.row = max(0, neighbor.row + random(-SHAKE, SHAKE)*AMT_FADE_PER_FRAME); // Decrease opacity by 5 each frame
    neighbor.col = max(0, neighbor.col + random(-SHAKE, SHAKE)*AMT_FADE_PER_FRAME); // Decrease opacity by 5 each frame

    stroke(255, 0, neighbor.color, neighbor.opacity);
    fill(neighbor.color, 0, 255, neighbor.opacity);
    rect(neighborX, neighborY, CELL_SIZE, CELL_SIZE);
  }
  // Remove neighbors with zero opacity
  allNeighbors = allNeighbors.filter((neighbor) => neighbor.opacity > 0);
  // Display FPS Counter
  fpsCounter();
}

function getRandomNeighbors(row, col) {
  let neighbors = []; // Initialize an empty array to store neighbor cells

  // Loop through the cells surrounding the given cell (row, col)
  for (let dRow = -NUM_OF_NEIGHBORS; dRow <= NUM_OF_NEIGHBORS; dRow++) {
    for (let dCol = -NUM_OF_NEIGHBORS; dCol <= NUM_OF_NEIGHBORS; dCol++) {
      // Calculate the neighboring cell's row and column indices
      let neighborRow = row + dRow;
      let neighborCol = col + dCol;

      // Check if the current cell in the loop is the given cell (row, col)
      let isCurrentCell = dRow === 0 && dCol === 0;

      // Check if the neighboring cell is within the grid boundaries
      let isInBounds =
        neighborRow >= 0 &&
        neighborRow < numRows &&
        neighborCol >= 0 &&
        neighborCol < numCols;

      // If the cell is not the given cell, is within bounds, and has a 50% chance,
      // add the neighboring cell to the neighbors array
      if (!isCurrentCell && isInBounds && Math.random() < PROB_OF_NEIGHBOR) {
        neighbors.push({
          row: neighborRow,
          col: neighborCol,
          opacity: 255, // Initial opacity of the neighbor
          color: 255
        });
      }
    }
  }

  // Return the array of randomly-selected neighboring cells
  return neighbors;
}

function getPosition() {
  let radius = min(windowWidth, windowHeight)/1.5; // Radius of the infinity symbol
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;

  let xPosition = centerX + radius * Math.sin(angle) / (1 + Math.pow(Math.cos(angle), 2));
  let yPosition = centerY + radius * Math.sin(angle) * Math.cos(angle) / (1 + Math.pow(Math.cos(angle), 2));
  angle += MOVEMENT_SPEED; // Adjust the increment to control the speed of movement

  return { xPosition, yPosition };
}

// Key press event to toggle FPS display
function keyPressed() {
  if (keyCode === 70) { // Check if the pressed key is 'f'
    showFPS = !showFPS; // Toggle showFPS variable
  }
}

function fpsCounter() {
  // Increment frame counter
  frameCounter++;

  // Update FPS display every fpsUpdateInterval frames
  if (frameCounter >= fpsUpdateInterval) {
    currentFPS = floor(frameRate()); // Update currentFPS
    frameCounter = 0; // Reset frame counter
  }

  // Draw FPS counter if showFPS is true
  if (showFPS) {
    push();
    fill(255);
    noStroke();
    textSize(15);
    text("FPS: " + currentFPS, 10, 20);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  numRows = Math.ceil(windowHeight / CELL_SIZE); // number of rows in the grid
  numCols = Math.ceil(windowWidth / CELL_SIZE); // number of columns in the grid
}