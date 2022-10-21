const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let squares = [];

const degToRad = (deg) => {
    return deg/ 180 * Math.PI
}

// Event that tracks the mouse click and triggers the square animation.
canvas.addEventListener('click',function(s){
    for (let i = 0; i < 10; i++) {
        squares.push(new Square(s.x,s.y));
        // console.log("Squares")
    }
})

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
animateSquare();

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