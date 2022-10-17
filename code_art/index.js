const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let atoms = [];
let squares = [];

const degToRad = (deg) => {
    return deg/ 180 * Math.PI
}

// Event that tracks mouse movement and draws a rectangle when the mouse location changes
canvas.addEventListener('mousemove', function (e){
    console.log(e.x,e.y);
    ctx.beginPath();
    ctx.rect(e.x,e.y,5,5);
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
canvas.addEventListener('click',function(e){
    for (let i = 0; i < 20; i++) {
        atoms.push(new Atom(e.x,e.y));
        console.log("Atom")
    }
})

canvas.addEventListener('click',function(s){
    for (let i = 0; i < 20; i++) {
        squares.push(new Square(s.x,s.y));
        console.log("Squares")
    }
})

const animateAtom = () => {
    atoms.forEach(atom => {
        atom.draw();
        atom.update();
    })
    requestAnimationFrame(animateAtom)
}

const animateSquare = () => {
    squares.forEach(square => {
        square.draw();
        square.update();
        
    })
    requestAnimationFrame(animateSquare)
}

animateAtom();
animateSquare();

class Atom {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.radius = Math.random() + 1;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        //this.rotate = Math.random();
    }

    update(){
        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y, this.radius,0,Math.PI*2)
        //ctx.rotate(this.rotate)
        ctx.fill();
    }
}

class Square {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.x2 = x - 25;
        this.y2 = y - 25;
    }

    update(){
        this.x += 25;
        this.y += 25;
        this.x2 -= 25;
        this.y2 -= 25;
    }

    draw(){
        ctx.beginPath();
        ctx.rect(this.x,this.y,20,20)
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(this.x2,this.y2,20,20)
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(this.x2,this.y,20,20)
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(this.x,this.y2,20,20)
        ctx.stroke();
    }
}