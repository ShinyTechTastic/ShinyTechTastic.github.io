var world = (function(){
  var seed = 0x5893;
  var map = {};
  
  var nf = new ClassicalNoise();
  
  function getMapAt(x,y){
    var id = getId(x,y);
    if ( !map[id] ){
      map[id] = generateMap(x,y,id);
    }
    return map[id];
  }
  
  function translate(x){
    if ( x > 0.5 ){
      return 6; // mounts
    }else if ( x > 0.4 ){
      return 5; // mounts
    }else if ( x > 0.2 ){
      return 4; // trees
    }else if ( x > 0.12 ){
      return 3; // plain
    }else if ( x > 0.1 ){
      return 2; // beach
    }else if ( x > -0.2 ){
      return 1; // shallow
    }else{
      return 0; // deep
    }
  }
  
  function generateMap(x,y,id){
    var z = nf.noise(x*0.02,y*0.02,0.0);
    var l = (nf.noise(x*0.01,y*0.01,0.0) * 0.2)
          + (nf.noise(z+x*0.1,y*0.1,-z   ) * 0.2)
          + (nf.noise(x*0.04,z+y*0.04,z  ) * 0.6);
    return { surface : translate( l ) };
    //return { surface:Math.floor((Math.abs(x+y)/5)%3) };
    //return { surface:Math.floor(Math.random()*3) };
  }
  
  function getId(x,y){
    return ""+Math.floor(x)+":"+Math.floor(y);
  }
  
  return {
    getMapAt:getMapAt
  };
})();