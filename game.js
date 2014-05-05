var sidebar = document.getElementById('sidebar');

var stateDragging = {
  pos:{x:0,y:0},
  mousemove:function(pos){
    var dx = pos.x - this.pos.x;
    var dy = pos.y - this.pos.y;
    this.pos = pos;
    render.scroll(dx,dy);
  },
  mouseup:function(){
    render.setState( stateReady );
  },
  mouseout:function(){
    render.setState( stateReady );
  }
}

var stateReady = {
  mousedown:function( pos ){
    render.setState( stateDragging );
    stateDragging.pos = pos;
  },
  mousemove:function( pos ){
    var worldPos = render.toWorld(pos);
    var n = world.getMapAt(worldPos.x,worldPos.y);

    sidebar.innerHTML= '<h2>Tile</h2>'+
    '<p class="location">loc: '+worldPos.x+','+worldPos.y+'</p>'+
    '<p class="altitude">alt: '+n.alt+'m</p>'+
    '<p class="surface">surface: '+world.decodeSurface(n.surface)+
    ' - '+world.decodeStrata(n.strata)+'</p>'+
    '<p class="vegitation">'+world.decodePlant(n.veg)+'</p>';
  }
}


var stateLander = {
  mousedown:function( pos ){
    render.setExtra( null );
    render.setState( stateDragging );
  },
  mousemove:function( pos ){
    var worldPos = render.toWorld(pos);
    var n = world.getMapAt(worldPos.x,worldPos.y);

    sidebar.innerHTML= '<h2>Landing target</h2>'+
    '<p class="location">loc: '+worldPos.x+','+worldPos.y+'</p>'+
    '<p class="altitude">alt: '+n.alt+'m</p>'+
    '<p class="surface">surface: '+world.decodeSurface(n.surface)+
    ' - '+world.decodeStrata(n.strata)+'</p>'+
    '<p class="vegitation">'+world.decodePlant(n.veg)+'</p>';

    render.setExtra( function(context){
      context.beginPath();
      context.arc(world.x, world.y, 8, 0, 2 * Math.PI, false);
      context.fillStyle = 'rgba(255,255,0,0.2)';
      context.fill();
      context.lineWidth = 0.2;
      context.strokeStyle = '#ffffff';
      context.stroke();
    });
  }
}


function update(){
}

render.setState( stateReady );

setInterval(  update , 10 );
setInterval(  render.draw , 20 );

controls.setupButtons();