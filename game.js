// Prepare the canvas
var body = document.getElementById('body');
var canvas = document.getElementById('bodyCanvas');
var ctx = canvas.getContext('2d');

var viewX = 0.0; // these control the view position
var viewY = 0.0;

var scale = 32; // the size of each tile


var surface = [
  /* 0 */ { fillStyle:"rgb(200,0,0)"},
  /* 1 */ { fillStyle:"rgb(200,200,0)"},
  /* 2 */ { fillStyle:"rgb(0,0,200)"}
  ];

var missingSurface = { fillStlye:"rgb(255,128,128)" };

function draw(){
  if ( canvas.width != body.clientWidth ||
       canvas.height != body.clientHeight ){
    canvas.width = body.clientWidth;
    canvas.height = body.clientHeight;
  }
  
  var width = canvas.width;
  var height = canvas.height;
  
  var tilesW = width/scale;
  var tilesH = height/scale;
  
  for ( var x=0; x<tilesW ; x++ ){
    for ( var y=0; y<tilesH ; y++ ){
      var n = world.getMapAt(x,y);
      var s = surface[ n.surface ] || missingSurface;
      ctx.fillStyle = s.fillStyle;//"rgb(200,0,0)";
      ctx.fillRect (x*scale, y*scale, scale, scale);
    }
  }
  /*
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (x, y, 55, 50);

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (30, 30, 55, 50);
        */
}

function update(){
}

setInterval(  update , 10 );
setInterval(  draw , 20 );