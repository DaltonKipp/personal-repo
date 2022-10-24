const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let Ourizons = [];

const degr = (deg) => {
    return deg/ 180 * Math.PI
}
ctx.fillStyle = 'white'
ctx.strokeStyle = 'black'
ctx.lineWidth = 100;
ctx.beginPath();
ctx.arc(canvas.width/2,canvas.height/2,100,0,Math.PI*2)
ctx.stroke();
ctx.fill();

ctx.beginPath();
ctx.moveTo(canvas.width/2,canvas.height/2);
ctx.arc(canvas.width/2+100,canvas.height/2,400,degr(300),degr(60));
ctx.moveTo(canvas.width/2,canvas.height/2);
ctx.stroke();
ctx.fill();

ctx.beginPath();
ctx.moveTo(canvas.width/2,canvas.height/2);
ctx.arc(canvas.width/2+75,canvas.height/2,100,degr(280),degr(75));
ctx.moveTo(canvas.width/2,canvas.height/2);
ctx.stroke();
ctx.fill();