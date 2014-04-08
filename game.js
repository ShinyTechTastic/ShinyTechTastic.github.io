// Prepare the canvas
var canvas = document.getElementById('bodyCanvas');
var ctx = canvas.getContext('2d');

var x = 0.0;
var y = 0.0;

function draw(){
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (x, y, 55, 50);

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (30, 30, 55, 50);
}

function update(){
  x += 0.2;
  y += 0.2;
  x = x % 50;
  y = y % 50;
}

setInterval(  update , 10 );
setInterval(  draw , 20 );