var CircleNum 
var size = 10;
var amplitude = 180;
var speed = 100;
var CircleNum = 1000;
var cols = 20;
var radScale = 2;
var radius = 10;
let set1 = [];
let set2 = [];

function setup() { 
  createCanvas(windowWidth, windowHeight);
  spacing = windowWidth / cols;
  generateCircles(windowHeight/2);
} 

function draw() { 
  background(10,10,10,25);
  originalDNA()  

  // set1.forEach((Circle, index) => {
  //   Circle.drawCircle(); // Draw circles
  //   // Circle.update();     // Update circle position
  // });

  // set2.forEach((Circle, index) => {
  //   Circle.drawCircle(); // Draw circles
  //   // Circle.update();     // Update circle position
  // });
}

function originalDNA(){
  for ( i = 0; i < CircleNum; i++) {

    var x = i*(width)/(CircleNum);
  	var x2 = (i+1)*(width)/(CircleNum);
    var x3 = i*(width)/(CircleNum);

    var r = map(x, 0, windowWidth, 255, 255);
    var g = map(x, 0, windowWidth, 255, 255);
  	var b = map(x, 0, windowWidth, 255, 255);
      
    // Falling Circles
		fill(r,g,b,20);
		noStroke();
		ellipse(x,height/2+amplitude*tan(50*i+frameCount/speed/10),2*size,size);

    // Connecting Lines
    // strokeWeight(0.1);
    // stroke(r,g,b);
    // line(x,height/2+amplitude*sin(50*i+frameCount/speed),
    //   x2,height/2+amplitude*cos(PI*(3/4)+50*i+frameCount/speed))
      
    // Red Strand
    fill(r,0,0,255);
    noStroke();
  	ellipse(x,height/2+amplitude*sin(50*i+frameCount/speed),size,size);

    // Cyan Strand
		fill(0,g,b,255);
    noStroke();
  	ellipse(x,height/2+amplitude*cos(PI*(3/4)+50*i+frameCount/speed),size,size);  	
  }
}

class Circle {
  constructor(x, y, radius, color) {
    this.x = x; // X Position
    this.y = y; // Centerline
    this.initialX = x; // Store initial position of x
    this.initialY = y; // Store initial position of y
    this.initialRad = radius; // Strore initial radius
    this.radius = radius;
    this.color = color;
    this.radSpeed = random(-0.1, 0.1); // Random radius size speed
  }

  // Draw the circle
  drawCircle() {
    fill(this.color); // Ellipse Fill Color
    ellipse(this.x, this.y, this.radius * radScale, this.radius * radScale); // Ellipse
    noStroke(); // No Outline
    // stroke(0);
  }

  update() {
    this.y += this.speedY;
  }
}

function generateCircles(center) {
  for(let x=0; x < cols; x++) {
    let y1 = center + amplitude * sin(x);
    set1.push(new Circle(x * spacing, y1, radius, [255,0,0]))
    let y2 = center + amplitude * cos(x);
    set2.push(new Circle(x * spacing, y2, radius, [0,255,255]))
  }
  console.log("set1:",set1);
  console.log("set2:",set2);
}

function generateLines() {

}