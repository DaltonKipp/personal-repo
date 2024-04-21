var CircleNum 
var Diameter = 20

function setup() { 
  createCanvas(windowWidth, windowHeight);
  CircleNum = 50;

} 

function draw() { 
  background(15,15,30,50);
  
  for ( i = 0; i < CircleNum; i++) {
    var g = map(mouseX, 0, 640,100, 255);
  	var b = map(mouseX, 0, 640, 255, 0);
  	var x = i*(width)/(CircleNum);
		fill(random (0,255),g,b,200);
    noStroke();
  	ellipse(x,height/2+100*sin(50*i+frameCount/100),Diameter,Diameter);
    
  	var x2 = i*(width)/(CircleNum);
		fill(random (0,255),g,b,200);
    noStroke();
  	ellipse(x2,height/2+100*cos(PI*(3/4)+50*i+frameCount/100),Diameter,Diameter);
    
    strokeWeight(0.1);
    stroke(255);
    line(x,height/2+100*sin(50*i+frameCount/1000),
      x2,height/2+30*cos(PI*(3/4)+50*i+frameCount/100))
      
		var x3 = i*(width)/(CircleNum);
		fill(random (0,255),g,b,20);
		noStroke();
		ellipse(x3,height/2+100*tan(50*i+frameCount/100),Diameter,Diameter);
  	
  }
}