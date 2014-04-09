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
    return { surface:(((x+y)/5)%2) };
  }
  
  function getId(x,y){
    return ""+Math.floor(x)+":"+Math.floor(y);
  }
  
  return {
    getMapAt:getMapAt
  };
})();