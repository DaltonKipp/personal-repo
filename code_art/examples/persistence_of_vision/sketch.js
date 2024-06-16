/*
----- Coding Tutorial by Patt Vira ----- 
Name: Persistence of Vision Effect
Video Tutorial: https://youtu.be/qO6A8iZZM04

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
*/

let cols;
let rows;
let size = 5;
let grid = [];
let b;

function setup() {
  createCanvas(400, 400);
  cols = width / size;
  rows = height / size;

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }

  b = new Block();
}

function draw() {
  background(220);
  let x = floor(mouseX / size);
  let y = floor(mouseY / size);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] == 0) {
        fill(255);
      } else {
        fill(0);
      }
      noStroke();
      rect(i * size, j * size, size, size);
    }
  }

  b.display(grid);
}

class Block {
  constructor() {
    this.x = floor(cols / 2);
    this.y = floor(rows / 2);

    this.margin = 0;
    this.dmargin = 1;
  }

  display(grid) {
    for (let i = -this.margin; i < this.margin; i++) {
      for (let j = -this.margin; j < this.margin; j++) {
        let x = this.x + i;
        let y = this.y + j;

        x = constrain(x, 0, cols - 1);
        y = constrain(y, 0, rows - 1);
        if (grid[x][y] == 0) {
          fill(0);
        } else {
          fill(255);
        }
        rect(x * size, y * size, size, size);
      }
    }

    if (this.margin > floor(cols / 2) || this.margin < 0) {
      this.dmargin *= -1;
    }

    this.margin += this.dmargin;
  }
}
