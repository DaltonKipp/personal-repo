const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let atoms = [];

const degToRad = (deg) => {
    return deg/ 180 * Math.PI
}

// Event that tracks the mouse click and triggers the atom animation.
canvas.addEventListener('mousemove',function(e){
    for (let i = 0; i < 5; i++) {
        atoms.push(new Atom(e.x,e.y));
        // console.log("Atom")
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

// Calls animation functions
animateAtom();

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
        // ctx.arc(this.x,this.y, this.radius,0,Math.PI*2) // Draws circle particles
        ctx.rect(this.x,this.y,this.radius*5,this.radius*5) // Draws rectangle particles
        // ctx.rotate(this.rotate)
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

// Generates random atoms on the canvas
generateAtoms();