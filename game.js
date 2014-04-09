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
  
  var tilesW = Math.ceil(width/scale)+2;
  var tilesH = Math.ceil(height/scale)+2;
  
  var startX = Math.floor(-viewX/scale)-1;
  var startY = Math.floor(-viewY/scale)-1;
  var endX = startX + tilesW;
  var endY = startY + tilesH;
  
  ctx.save();
  ctx.translate( viewX , viewY );
  ctx.scale( scale , scale );
  //ctx.font = "0.2pt Arial";
      
  for ( var x=startX; x<endX ; x++ ){
    for ( var y=startY; y<endY ; y++ ){
      var n = world.getMapAt(x,y);
      var s = surface[ n.surface ] || missingSurface;
      ctx.save();
      ctx.translate(x,y);
      ctx.fillStyle = s.fillStyle;
      ctx.fillRect(0.0, 0.0, 1.0, 1.0);
      ctx.restore();
    }
  }
  
  ctx.restore();
  /*
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (x, y, 55, 50);

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (30, 30, 55, 50);
        */
}

function update(){
}


function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

var stateDragging = {
  pos:{x:0,y:0},
  mousemove:function(pos){
    var dx = pos.x - this.pos.x;
    var dy = pos.y - this.pos.y;
    this.pos = pos;
    viewX += dx;
    viewY += dy;
//    console.log( viewX , viewY );
  },
  mouseup:function(){
    state = stateReady;
  }
}

var stateReady = {
  mousedown:function( pos ){
    state = stateDragging;
    state.pos = pos;
  }
}

var state = stateReady;

canvas.addEventListener("mousedown", function(event){
//  console.log("mousedown");
  if ( state.mousedown ){
    state.mousedown( getMousePos( event ) );
  }
}, true /* consume? */ );

canvas.addEventListener('mousemove', function(event) {
//  console.log("mousemove");
  if ( state.mousemove ){
    state.mousemove( getMousePos( event ) );
  }
}, true );

canvas.addEventListener('mouseup', function(evetn) {
//  console.log("mouseup");
  if ( state.mouseup ){
    state.mouseup( getMousePos( event ) );
  }
}, true );


setInterval(  update , 10 );
setInterval(  draw , 20 );