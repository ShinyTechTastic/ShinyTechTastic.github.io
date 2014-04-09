var world = (function(){
  var seed = 0x5893;
  var map = {};
  
  function getMapAt(x,y){
    var id = getId(x,y);
    if ( !map[id] ){
      map[id] = generateMap(x,y,id);
    }
    return map[id];
  }
  
  function generateMap(x,y,id){
    //return { surface:Math.floor((Math.abs(x+y)/5)%3) };
    return { surface:Math.floor(Math.random()*3) };
  }
  
  function getId(x,y){
    return ""+Math.floor(x)+":"+Math.floor(y);
  }
  
  return {
    getMapAt:getMapAt
  };
})();