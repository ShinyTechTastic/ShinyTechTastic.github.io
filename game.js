// Prepare the canvas
var body = document.getElementById('body');
var canvas = document.getElementById('bodyCanvas');
var ctx = canvas.getContext('2d');
var sidebar = document.getElementById('sidebar');

var viewX = 0.0; // these control the view position
var viewY = 0.0;

var scale =  8; // the size of each tile


var surface = {
   0 : { fillStyle:"rgb(0,0,80)"},
   1 : { fillStyle:"rgb(20,20,160)"},
   2 : { fillStyle:"rgb(200,200,0)"},
   3 : { fillStyle:"rgb(50,200,50)"},
   4 : { fillStyle:"rgb(30,100,30)"},
   5 : { fillStyle:"rgb(200,200,200)"},
   6 : { fillStyle:"rgb(250,250,250)"}
  };

var vegstyle = {
  0:{}
};

var missingSurface = { fillStyle:"rgb(255,128,128)" };

function randColor(){
  return Math.floor(Math.random() * 255 )
}

function getVeg( vid ){
  var n = vegstyle[vid];
  if ( n ){
    return n;
  }
  n = { fillStyle:"rgb("+randColor()+","+randColor()+","+randColor()+")" };
  vegstyle[vid] = n;
  return n;
}

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
      var sv = getVeg( n.veg );
      ctx.save();
      ctx.translate(x,y);
      ctx.fillStyle = s.fillStyle;
      ctx.fillRect(0.0, 0.0, 1.0, 1.0);
      if ( n.veg !== 0 ){
        ctx.fillStyle = sv.fillStyle;
        ctx.fillRect(0.4, 0.4, 0.2, 0.2);
 //       ctx.circle( 0.5 , 0.5 , 0.5 );
      }
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

function getTouchPos(evt) {
  var rect = canvas.getBoundingClientRect();

  if (event.targetTouches.length == 1) {
    var touch = event.targetTouches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }else{
    return null;
  }
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
  },
  mouseout:function(){
    state = stateReady;
  }
}

var stateReady = {
  mousedown:function( pos ){
    state = stateDragging;
    state.pos = pos;
  },
  mousemove:function( pos ){
    var worldX = Math.floor((pos.x - viewX) / scale);
    var worldY = Math.floor((pos.y - viewY) / scale);
    var n = world.getMapAt(worldX,worldY);

    sidebar.innerHTML= '<h2>Tile</h2>'+
    '<p class="location">'+worldX+','+worldY+'</p>'+
    '<p class="altitude">'+n.alt+'</p>'+
    '<p class="surface">'+world.decodeSurface(n.surface)+'</p>'+
    '<p class="vegitation">'+world.decodePlant(n.veg)+'</p>';
  }
}

var state = stateReady;


canvas.addEventListener("touchstart", function(event){
  if ( state.mousedown ){
    var t = getTouchPos( event );
    if (t) state.mousedown( t );
  }
}, true /* consume? */ );

canvas.addEventListener('touchmove', function(event) {
//  console.log("mousemove");
  if ( state.mousemove ){
    var t = getTouchPos( event );
    if (t) state.mousemove( gt );
  }
}, true );

canvas.addEventListener('touchend', function(event) {
//  console.log("mouseup");
  if ( state.mouseup ){
    var t = getTouchPos( event );
    if (t) state.mouseup( t );
  }
}, true );

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

canvas.addEventListener('mouseup', function(event) {
//  console.log("mouseup");
  if ( state.mouseup ){
    state.mouseup( getMousePos( event ) );
  }
}, true );

canvas.addEventListener('mouseout', function(event) {
//  console.log("mouseout");
  if ( state.mouseout ){
    state.mouseout( getMousePos( event ) );
  }
}, true );

setInterval(  update , 10 );
setInterval(  draw , 20 );
