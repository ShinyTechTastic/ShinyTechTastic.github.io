var world = (function(){
  var seed = 0x5893;
  var map = {};
  var plants = {};
  
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
  
  function getPlant( pid ){
    if ( !plants[pid] ){
      var min = Math.random() - 0.5;
      var min = min*min;
      plants[pid] = { minAlt : min,
                      maxAlt : min + Math.random() };
    }
    return plants[pid];
  }

  function vegtranslate( x , y ,alt ){
    var z = nf.noise(x*0.02,y*0.02,5.0)*5.0;
    var l = (nf.noise(x*0.01,y*0.01,0.0) * 0.2)
          + (nf.noise(z+x*0.1,y*0.1,-z   ) * 0.2)
          + (nf.noise(x*0.04,z+y*0.04,z  ) * 0.6);    
    var scale;
    if ( l > 0.6 ){
      scale = 0.1;
    }else if ( l > 0.2 ){
      scale = 0.01;
    }else if ( l > -0.2 ){
      scale = 0.001;
    }else{
      return 0;// desert
    }
    var p = Math.floor((nf.noise(x*scale,y*scale,-5.0)+1)*25.0);
    var plant = getPlant(p);
    if ( plant.minAlt < alt && plant.maxAlt > alt ){
      return p;
    }else{
      return 0; // outside plant's range - desert
    }
  }

  function vegAltCheck( alt , vid ){
    var p = getPlant(vid);
    if ( p.minAlt > alt ) return 0;
    if ( p.maxAlt < alt ) return 0;
    return vid;
  }
  
  function generateMap(x,y,id){
    var z = nf.noise(x*0.02,y*0.02,0.0);
    var l = (nf.noise(x*0.01,y*0.01,0.0) * 0.2)
          + (nf.noise(z+x*0.1,y*0.1,-z   ) * 0.2)
          + (nf.noise(x*0.04,z+y*0.04,z  ) * 0.6);
    var sv = translate( l );
    return { 
      surface : sv,
      veg: vegtranslate(x,y,l)
     };
  }
  
  function getId(x,y){
    return ""+Math.floor(x)+":"+Math.floor(y);
  }

  var surfaceString = [
  "Deep water","water","beach","lowlands","highlands","hills","peaks"];

  return {
    getMapAt:getMapAt,
    getPlant:getPlant,
    decodeSurface:function(sid){ return surfaceString[sid] },
    decodePlant:function(pid){
      return pid+":"+JSON.stringify(getPlant(pid));
    }
  };
})();