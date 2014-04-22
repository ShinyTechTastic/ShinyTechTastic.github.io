var world = (function(){
  var seed = 0x5893;
  var map = {};
  var plants = {
    0:{}, // none
  };

  var strataTypes = 3;
  var plantCount = 25;

  var strataString = [];
  for ( var id=0 ; id<strataTypes ; id++ ){
    strataString[id]=names.getName("strata",id);
  }
  
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
    var strataBase = Math.floor(((strata*0.5)+0.5) * strataTypes);
    strata = 1.0 + (((strata*0.5)+0.5) * 0.2);
    alt = Math.floor( alt * strata * 1000 );
    strataBase = ( strataBase+Math.floor(alt/500)+strataTypes) % strataTypes
    var surface = 0;
    if ( alt > 950 ){
      surface = 6; // peaks
    }else if ( alt > 800 ){
      surface = 5; // mounts
    }else if ( alt > 200 ){
      surface = 4; // trees
    }else if ( alt > 5 ){
      surface = 3; // plain
    }else if ( alt > -5 ){
      surface = 2; // beach
    }else if ( alt > -60 ){
      surface = 1; // shallow
    }else{
      surface = 0; // deep
    }
    return { alt:alt , surface:surface , strata:strataBase };
  }
  
  function getPlant( pid ){
    if ( !plants[pid] ){
      var min = (Math.random()*1.4)-0.4;
      var min = (min*min*min);
      var max = min + Math.random();
      if ( min < 0.05 && max > 0.05 ){
        max = 0.05; // 
      }
      if ( min < -0.05 && max > 0.05 ){
        max = 0.05; // 
      }
      var strataNum = Math.floor(Math.random() * strataTypes);
      plants[pid] = { minAlt : min*1000,
                      maxAlt : max*1000,
                      name:names.getName("plants"),
                      strataNone: strataNum };
    }
    return plants[pid];
  }

  function vegtranslate( x , y , data ){
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
    var p = 1 + (Math.floor((nf.noise(x*scale,y*scale,-5.0)+1)* plantCount ));
    for ( var n=0;n<10;n++){
      var plant = getPlant(p+n);
      if ( (plant.minAlt < data.alt) && 
           (plant.maxAlt > data.alt) &&
           (plant.strataNone != data.strata) ){
        return p+n;
      }
    }
    return 0; // no valid plants found...
  }

  function vegAltCheck( alt , vid ){
    var p = getPlant(vid);
    if ( p.minAlt > alt ) return 0;
    if ( p.maxAlt < alt ) return 0;
    return vid;
  }
  
  function generateMap(x,y,id){
    var point = surfacetranslate( x,y );
    point.veg = vegtranslate(x,y,point);
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
    decodeSurface:function(sid){ return surfaceString[sid]; },
    decodeStrata:function(sid){ return strataString[sid]; },
    decodePlant:function(pid){ return getPlant(pid).name||""; }
  };
})();