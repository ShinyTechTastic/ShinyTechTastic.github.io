var world = (function(){
  var seed = 0x5893;
  var map = {};
  var plants = {};

  var strataTypes = [
    { peak:0.6 , mount:0.4 , trees:0.2 , plain:0.0, beach:-0.1, shallow:-0.2 },
    { peak:0.6 , mount:0.4 , trees:0.3 , plain:0.0, beach:0.0, shallow:-0.4 },
    { peak:0.9 , mount:0.7 , trees:-0.2 , plain:-0.4, beach:-0.7, shallow:-0.8 },
    { peak:0.7 , mount:0.5 , trees:0.3 , plain:0.2, beach:0.1, shallow:-0.6 }
  ];
  
  var nf = new ClassicalNoise();
  
  function getMapAt(x,y){
    var id = getId(x,y);
    if ( !map[id] ){
      map[id] = generateMap(x,y,id);
    }
    return map[id];
  }
  
  function surfacetranslate(x,y){
    var z = nf.noise(x*0.02,y*0.02,0.0);
    var alt = (nf.noise(x*0.001,y*0.001,0.0) * 0.2 )
            + (nf.noise(x*0.01,y*0.01,0.0)   * 0.2 )
            + (nf.noise(z+x*0.1,y*0.1,-z   ) * 0.2 )
            + (nf.noise(x*0.04,z+y*0.04,z  ) * 0.6 );
    var strata = (nf.noise(x*0.0015,y*0.0015,0.0) * 0.6 )
            + (nf.noise(x*0.01,y*0.01,0.0)   * 0.3 )
            + (nf.noise(z+x*0.1,y*0.1,z   ) * 0.05 )
            + (nf.noise(x*0.3,z+y*0.3,+z  ) * 0.05 );
    strata = Math.floor(((strata*0.5)+0.5) * strataTypes.length);
    var strataType = strataTypes[strata];
    var surface = 0;
    if ( alt > strataType.peak ){
      surface = 6; // peaks
    }else if ( alt > strataType.mount ){
      surface = 5; // mounts
    }else if ( alt > strataType.trees ){
      surface = 4; // trees
    }else if ( alt > strataType.plains ){
      surface = 3; // plain
    }else if ( alt > strataType.beach ){
      surface = 2; // beach
    }else if ( alt > strataType.shallow ){
      surface = 1; // shallow
    }else{
      surface = 0; // deep
    }
    return { alt:alt , surface:surface , strata:strata };
  }
  
  function getPlant( pid ){
    if ( !plants[pid] ){
      var min = (Math.random()*2.0) - 0.5;
      var min = (min*min*min)+0.1;
      var max = min + Math.random();
      if ( min < 0.1 && max > 0.12 ){
        max = 0.12; // 
      }
      plants[pid] = { minAlt : min,
                      maxAlt : max };
    }
    return plants[pid];
  }

  function vegtranslate( x , y , alt ){
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
    var point = surfacetranslate( x,y );
    point.veg = vegtranslate(x,y,point.alt,point.surface);
    return point;
  }
  
  function getId(x,y){
    return "id:"+Math.floor(x)+":"+Math.floor(y);
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