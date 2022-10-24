const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  return ({ context, width, height }) => {

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    const myCircle = new Circle(100,100,50);
    myCircle.draw(context);
  };
};

canvasSketch(sketch, settings);

class Circle {
  constructor(x,y,radius){
  this.x = x;
  thix.y = y;
  this.radius = radius;
  }

  draw(context){
    context.begingPath();
    context.arc(this.x,this.y,this.radius,0,Math.PI*2)
    context.stroke();
  }
}