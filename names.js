var names = (function(){

  var sets = {
    plants:{ type:"each",
      data:[
        {type:"one",data:["Bee","Cow","Burr","Stem","Stalk","Stond","Retech",
                      "Roing","Eee","Gurn"]},
        {type:"one",data:["narl","spwan","twink","blarg","gurgle","gourd","tran",
                      "tee","trout","point"]},
        {type:"one",data:["-argle","-pod","-flower","-vine","-tree"]}
      ],
    },
    strata:{ type:"each",
      data:[
        {type:"one",data:["Bee","Cow","Burr","Stem","Stalk","Stond","Retech",
                      "Roing","Eee","Gurn"]},
        {type:"one",data:["narl","spwan","twink","blarg","gurgle","gourd","tran",
                      "tee","trout","point"]},
        {type:"one",data:["ion","aon","eon"]}
      ],
    }
  };

  function generateFrom( set , id ){
    if ( set.type === "each" ){
      var resp = ""
      for ( var n in set.data ){
        resp += generateFrom( set.data[n] );
      }
      return resp;
    }else if ( set.type === "one" ){
      var n = Math.floor(Math.random()*set.data.length)
      return set.data[n];
    }
  }

  return {
    getName:function getName(set,id){
      return generateFrom( sets[set] , id );
    }
  };
})();