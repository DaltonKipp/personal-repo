let cardImg;
let titleFont;

function preload() {
  cardImg = loadImage(
    "https://via.placeholder.com/300x300?text=ART",
    () => console.log("✅ remote image loaded"),
    () => {
      console.warn("❌ remote failed, loading local fallback");
      cardImg = loadImage("assets/lenny.png");
    }
  );
  titleFont = loadFont(
    "assets/BarberChop.otf",
    () => console.log("✅ font loaded"),
    () => {
      console.warn("❌ font failed—falling back to serif");
      titleFont = null;
    }
  );
}

function setup() {
  createCanvas(400, 560);
  noLoop();
}

function draw() {
  background(50);
  drawCard(50, 30, 300, 480, {
    title: "Lenny",
    cost: 4,
    attack: 50,
    health: 300,
    description:
      "When this dies, resurrect 10 of the highest-cost minions that have fallen this game.",
  });
}

function drawCard(x, y, w, h, data) {
  push();
  translate(x, y);

  // CARD BACKGROUND & BORDER
  stroke(200);
  strokeWeight(4);
  fill(30);
  rect(0, 0, w, h, 20);

  // TITLE BAR
  noStroke();
  fill(10, 10, 80);
  rect(0, 0, w, 50, 20, 20, 0, 0);
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(20);
  if (titleFont) textFont(titleFont);
  else textFont("serif");
  text(data.title, 12, 25);

  // COST CIRCLE
  fill(200, 50, 50);
  stroke(200);
  strokeWeight(2);
  ellipse(w - 30, 25, 40);
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  text(data.cost, w - 30, 25);

  // ARTWORK AREA
  stroke(150);
  strokeWeight(2);
  fill(0);
  rect(10, 60, w - 20, w - 20, 10);
  image(cardImg, 10, 60, w - 20, w - 20);

  // DESCRIPTION BOX (dynamic height)
  const descX = 10;
  const descY = 60 + (w - 20) + 10;
  const descH = h - descY - 60; // leave room for bottom bar
  const descW = w - 20;
  noStroke();
  fill(20);
  rect(descX, descY, descW, descH, 10);
  fill(220);
  textSize(14);
  textAlign(LEFT, TOP);
  text(data.description, descX + 8, descY + 8, descW - 16, descH - 16);

  // STATS BAR
  fill(15);
  rect(0, h - 60, w, 60, 0, 0, 20, 20);
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(data.attack, w * 0.25, h - 30);
  text(data.health, w * 0.75, h - 30);

  pop();
}
