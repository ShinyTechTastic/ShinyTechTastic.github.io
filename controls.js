var controls = (function(){

  var buttons = [
    { title:"Zoom Out" , click:function(){
      scale = Math.max(scale * 0.5 , 4.0);
    } },
    { title:"Zoom In" , click:function(){
      scale = Math.min(scale * 2.0 , 64.0);
    } }
  ];

  function buildButton( button , sidebar ){
    var btn = document.createElement('button');
    btn.innerText = button.title;
    btn.onclick = button.click;
    sidebar.appendChild(btn); 
  }

  function setupButtons(){
    var sidebar = document.getElementById('header');
    for ( var bid in buttons ){
      buildButton( buttons[bid] , sidebar );
    }
  }

  return {
    setupButtons:setupButtons
  };
})();