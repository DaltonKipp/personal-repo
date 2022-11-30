const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  let circles = [];
  for (let i = 0; i < 100; i++) {
    circles.push(new Circle(Math.random()*2048, Math.random()*2048, Math.random()*50+1))
  }
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    context.lineWidth = 10;

    circles.forEach(circle => {
      circle.draw(context);
    })
  };
};

canvasSketch(sketch, settings);

class Circle {
  constructor(x,y,radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw(context){
    context.beginPath();
    context.arc(this.x,this.y,this.radius,0,Math.PI*2)
    context.stroke();
  }
}