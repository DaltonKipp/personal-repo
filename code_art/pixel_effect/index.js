const canvas = document.getElementById('my-canvas')
const ctx = canvas.getContext('2d');

const img = new Image();
//img.src = 'liquid_stranger.png';
img.src = 'zd_logo.png';
//img.src = 'sample.png';

let brightnessArray = []; // Store 1D array of brightness values
let particlesArray = [];
let rgbArray = [];

class Particle {

    constructor () {
        this.x = Math.random() * canvas.width; // Starts at random x value of the canvas
        this.y = 0; // Start at the top of the canvas every time
        this.brightness = 0; // Sets initial brightness to 0
        this.velocity = Math.random() * 3 + 0.01; // Creates random velocity for the particle
        this.radius = Math.random() * 0.01 + 0.5; // Creates random radius for the particle
        this.randcolor = Math.floor(Math.random()*255);
        this.color = 'red'
        //console.log("constructor");
    }

    // Updates the particle position
    update() {
        this.y += this.velocity; // updates the y value by adding velocity
        // Resets the particle to the top of the canvas
        if (this.y >= canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
        // Maps the 1D brightness array to the correct 2D pixel position
        this.brightness = brightnessArray[Math.floor(this.y-1) * canvas.width + Math.floor(this.x)];
        //console.log("update");

        if (this.y <= this.x) {
            this.color = 'yellow'
        }
        if (this.y >= this.x) {
            this.color = 'cyan'
        }
        if (this.x <= this.y) {
            this.color = 'yellow'
        }
        if (this.x >= this.y) {
            this.color = 'cyan'
        }
        // if (this.brightness <= 10) {
        //     this.brightness = 10;
        //     this.color = 'white'
        // }
    }

    // Draws the particle by creating a white circle
    draw () {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        //ctx.fillStyle = rgbArray[Math.floor(this.y-1) * canvas.width + Math.floor(this.x)];;
        //ctx.fillStyle = `rgb(${Math.floor(Math.random()*255+50)},${Math.floor(Math.random()*255+50)},${Math.floor(Math.random()*255+50)})`;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        //console.log("draw");
    }
    
}

// Loads the image
img.onload = function () {

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // console.log(imgData.data); // rgba red green blue alpha for all pixels (0 to 255)

    // Calculates the brightness of each pixel and stores it in the brightnessArray
    for (let i = 0; i < imgData.data.length; i++) {
        const red = imgData.data[(i*4)];
        const green = imgData.data[(i * 4) + 1];
        const blue = imgData.data[(i * 4) + 2];
        const brightness = (red + green + blue) / 3;
        brightnessArray.push(brightness);
        rgbArray.push(`rgb(${red}, ${green}, ${blue})`);
    }

    // Generate 10,000 particles
    for (let i = 0; i < 10000; i++) {
        particlesArray.push(new Particle());
    }

    // Animates the particles by 
    const animate = () => {
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(particle => {
            particle.update();
            ctx.globalAlpha = particle.brightness * 0.002;
            particle.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();

};