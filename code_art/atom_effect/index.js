const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let atoms = [];
let squares = [];

const degToRad = (deg) => {
    return deg/ 180 * Math.PI
}

var slider = document.getElementById("myRange");
// var output = document.getElementById("demo");
// output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
// slider.oninput = function() {
//   output.innerHTML = this.value;
// }

// Event that tracks mouse movement and draws a rectangle when the mouse location changes
canvas.addEventListener('mousemove', function (e){
    // console.log(e.x,e.y);
    ctx.beginPath();
    ctx.rect(e.x,e.y,10,10);
    ctx.fill();
    ctx.stroke();

});

// Event that tracks mouse clicks and draws a circle when the left mouse button is clicked
canvas.addEventListener('click',function(c){
    console.log(c.x,c.y);
    ctx.beginPath();
    ctx.arc(c.x,c.y,10,0,degToRad(360))
    ctx.fill();
})

// Event that tracks the mouse click and triggers the atom animation.
canvas.addEventListener('mousemove',function(e){
    for (let i = 0; i < 10; i++) {
        atoms.push(new Atom(e.x,e.y));
        // console.log("Atom")
    }
})

// Event that tracks the mouse click and triggers the square animation.
canvas.addEventListener('click',function(s){
    for (let i = 0; i < 10; i++) {
        squares.push(new Square(s.x,s.y));
        // console.log("Squares")
    }
})

// Animate atom function
const animateAtom = () => {
    atoms.forEach((atom, index) => {
        atom.draw();
        atom.updateSpeed();
        atom.updateSize();
        atom.updateColor();

        if (atom.radius < 0.1){
            atoms.splice(index, 1);
        }
    })
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.restore();
    // Requests a new animation frame is created
    requestAnimationFrame(animateAtom)
}

// Animate square function
const animateSquare = () => {
    squares.forEach(square => {
        square.updateSize();
        square.draw();
        square.update();   
    })
    requestAnimationFrame(animateSquare)
}

// Calls animation functions
animateAtom();
animateSquare();

// Class that draws a series of circles moving in random directions from a point.
class Atom {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 10 + 1;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.rotate = Math.random();
    }
    // Updates the speed of the atom
    updateSpeed(){
        this.x += this.speedX;
        this.y += this.speedY;
    }
    // Updates the size of the atom
    updateSize(){
        this.radius -= 0.05;
    }
    // Updates the color of the atom based on size
    updateColor(){
        ctx.beginPath();
        if (this.radius >= 2) {
            ctx.fillStyle = 'black';
        }
        if (this.radius >= 4) {
            ctx.fillStyle = 'red';
        }
        if (this.radius >= 5) {
            ctx.fillStyle = 'cyan';
        }
        if (this.radius >= 6) {
            ctx.fillStyle = 'white';
        }
    }
    // Draws the atom particle
    draw(){
        //ctx.arc(this.x,this.y, this.radius,0,Math.PI*2) // Draws circle particles
        ctx.rect(this.x,this.y,this.radius*5,this.radius*5) // Draws rectangle particles
        //ctx.rotate(this.rotate)
        ctx.fill();
    }
}

// Class that draws a series of squares.
class Square {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.x2 = x - 50;
        this.y2 = y - 50;
        this.size = 1;
    }
    // Updates the size of the square
    update(){
        this.x += Math.random()*5-10;
        this.y += Math.random()*5-10;
        this.x2 -= Math.random()*5-10;
        this.y2 -= Math.random()*5-10;
    }
    // Updates the size of the square
    updateSize(){
        this.size += Math.random() + 0.2;
    }
    // Draw the squares
    draw(){
        ctx.beginPath();
        ctx.rect(this.x,this.y,this.size,this.size)
        ctx.fill();
        ctx.beginPath();
        ctx.rect(this.x2,this.y2,this.size,this.size)
        ctx.fill();
        ctx.beginPath();
        ctx.rect(this.x2,this.y,this.size,this.size)
        ctx.fill();
        ctx.beginPath();
        ctx.rect(this.x,this.y2,this.size,this.size)
        ctx.fill();
    }
}

const point = {
    x: canvas.width / 2,
    y: canvas.height / 2
}
let degree = 0;

const atomPath = () => {
    atoms.push(new Atom(point.x, point.y))
    point.x += Math.cos(degree)*100;
    point.y += Math.cos(degree)*100;
    degree++;
    requestAnimationFrame(atomPath)
}

// Random atom generation function
const generateAtoms = () => {
    atoms.push(new Atom(Math.random() * canvas.width, Math.random() * canvas.height))
    requestAnimationFrame(generateAtoms)
}

// Draw a hexagon grid
const a = 2 * Math.PI / 6;
const r = 11;

function init() {
  drawGrid(canvas.width, canvas.height);
  requestAnimationFrame(init);
}
init();

function drawGrid(width, height) {
  for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
    for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
      drawHexagon(x, y);
    }
  }
}

function drawHexagon(x, y) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  ctx.closePath();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(50,50,50,0.1)';
  ctx.stroke();
}

// Draws atoms along a path
atomPath();
// Generates random atoms on the canvas
generateAtoms();