/*
----- Coding Tutorial by Patt Vira ----- 
Name: Wave Pattern 
Video Tutorial: https://youtu.be/DNZPyoMBiFw?si=YFHNTw_vTuaozTkv

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
*/

let grid = [];
let cols = 15;
let rows = 15;
let loc = 100;
function setup() {
  createCanvas(400, 400);
  let rowSize = height / rows;
  let colSize = width / cols;

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(
        colSize / 2 + i * colSize,
        rowSize / 2 + j * rowSize,
        rowSize / 2,
        i * loc + j * loc
      );
    }
  }
}

function draw() {
  background(225);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].update();
      grid[i][j].display();
    }
  }
}

class Cell {
  constructor(x0, y0, r, angle) {
    this.r = r;
    this.angle = angle;
    this.x0 = x0;
    this.y0 = y0;
  }

  update() {
    this.x = this.r * cos(this.angle);
    this.y = this.r * sin(this.angle);
    this.angle += 0.05;
  }

  display() {
    // ellipse(this.x0, this.y0, this.r*2, this.r*2);
    // line(this.x0, this.y0, this.x0+this.x, this.y0+this.y);
    fill(0);
    ellipse(this.x0 + this.x, this.y0 + this.y, 5, 5);
  }
}
