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

document.addEventListener("DOMContentLoaded", function() {
  const toggleButton = document.getElementById('toggleButton');
  const controls = document.getElementById('controls');

  toggleButton.addEventListener('click', function() {
    controls.classList.toggle('hidden');
    if (controls.classList.contains('hidden')) {
      toggleButton.textContent = 'Show Controls';
    } else {
      toggleButton.textContent = 'Hide Controls';
    }
  });
});

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  background(0);
  angleMode(DEGREES);
  noFill();
  numRows = Math.ceil(windowHeight / getSliderValue('cellSize')); // number of rows in the grid
  numCols = Math.ceil(windowWidth / getSliderValue('cellSize')); // number of columns in the grid
}

function draw() {
  let cellSize = getSliderValue('cellSize');
  let colorR = getSliderValue('colorR');
  let colorG = getSliderValue('colorG');
  let colorB = getSliderValue('colorB');
  let strokeWeightValue = getSliderValue('strokeWeight');
  let startingAlpha = getSliderValue('startingAlpha');
  let backgroundColor = getSliderValue('backgroundColor');
  let backgroundAlpha = getSliderValue('backgroundAlpha');
  let probOfNeighbor = getSliderValue('probOfNeighbor');
  let amtFadePerFrame = getSliderValue('amtFadePerFrame');
  let numOfNeighbors = getSliderValue('numOfNeighbors');
  let movementSpeed = getSliderValue('movementSpeed');
  let shake = getSliderValue('shake');

  // Update labels with current slider values
  updateLabel('cellSize', cellSize);
  updateLabel('colorR', colorR);
  updateLabel('colorG', colorG);
  updateLabel('colorB', colorB);
  updateLabel('strokeWeight', strokeWeightValue);
  updateLabel('startingAlpha', startingAlpha);
  updateLabel('backgroundColor', backgroundColor);
  updateLabel('backgroundAlpha', backgroundAlpha);
  updateLabel('probOfNeighbor', probOfNeighbor);
  updateLabel('amtFadePerFrame', amtFadePerFrame);
  updateLabel('numOfNeighbors', numOfNeighbors);
  updateLabel('movementSpeed', movementSpeed);
  updateLabel('shake', shake);

  background(backgroundColor, backgroundAlpha);
  colorWithAlpha = color(colorR, colorG, colorB, startingAlpha);
  stroke(colorWithAlpha);
  strokeWeight(strokeWeightValue);

  // Calculate the row and column of the cell that the mouse is currently over
  let row = floor(getPosition(movementSpeed).yPosition / cellSize);
  let col = floor(getPosition(movementSpeed).xPosition / cellSize);

  // Check if the mouse has moved to a different cell
  if (row !== currentRow || col !== currentCol) {
    currentRow = row;
    currentCol = col;
    // Add new neighbors to the allNeighbors array
    allNeighbors.push(...getRandomNeighbors(row, col, numOfNeighbors, probOfNeighbor, cellSize));
  }

  // Use the calculated row and column to determine the position of the cell
  let x = col * cellSize;
  let y = row * cellSize;

  // Draw and update all neighbors
  for (let neighbor of allNeighbors) {
    let neighborX = neighbor.col * cellSize;
    let neighborY = neighbor.row * cellSize;

    // Update the opacity of the neighbor
    neighbor.opacity = max(0, neighbor.opacity - amtFadePerFrame); // Decrease opacity by amtFadePerFrame each frame
    neighbor.color = max(0, neighbor.color - amtFadePerFrame); // Decrease opacity by amtFadePerFrame each frame
    neighbor.row = max(0, neighbor.row + random(-shake, shake) * amtFadePerFrame); // Shake the row
    neighbor.col = max(0, neighbor.col + random(-shake, shake) * amtFadePerFrame); // Shake the col

    stroke(255, 0, neighbor.color, neighbor.opacity);
    fill(neighbor.color, 0, 255, neighbor.opacity);
    rect(neighborX, neighborY, cellSize, cellSize);
  }

  // Remove neighbors with zero opacity
  allNeighbors = allNeighbors.filter((neighbor) => neighbor.opacity > 0);

  // Display FPS Counter
  fpsCounter();
}

function getSliderValue(id) {
  return parseFloat(document.getElementById(id).value);
}

function updateLabel(id, value) {
  document.getElementById(id + 'Value').innerText = value;
}

function getRandomNeighbors(row, col, numOfNeighbors, probOfNeighbor, cellSize) {
  let neighbors = []; // Initialize an empty array to store neighbor cells

  // Loop through the cells surrounding the given cell (row, col)
  for (let dRow = -numOfNeighbors; dRow <= numOfNeighbors; dRow++) {
    for (let dCol = -numOfNeighbors; dCol <= numOfNeighbors; dCol++) {
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

      // If the cell is not the given cell, is within bounds, and has a probability of being a neighbor,
      // add the neighboring cell to the neighbors array
      if (!isCurrentCell && isInBounds && Math.random() < probOfNeighbor) {
        neighbors.push({
          row: neighborRow,
          col: neighborCol,
          opacity: 255, // Initial opacity of the neighbor
          color: 255,
        });
      }
    }
  }

  // Return the array of randomly-selected neighboring cells
  return neighbors;
}

function getPosition(movementSpeed) {
  let radius = min(windowWidth, windowHeight) / 1.5; // Radius of the infinity symbol
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;

  let xPosition = centerX + radius * Math.sin(angle) / (1 + Math.pow(Math.cos(angle), 2));
  let yPosition = centerY + radius * Math.sin(angle) * Math.cos(angle) / (1 + Math.pow(Math.cos(angle), 2));
  angle += movementSpeed; // Adjust the increment to control the speed of movement

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
  numRows = Math.ceil(windowHeight / getSliderValue('cellSize')); // number of rows in the grid
  numCols = Math.ceil(windowWidth / getSliderValue('cellSize')); // number of columns in the grid
}
