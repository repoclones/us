(() => {
  let money = 0;
  let mpc = 1;
  let mps = 0;
  let mpcBots = 0;
  let autoBots = 0;
  let supers = 0;
  let autoMult = 1;
  let mpcMult = 1;
  let eventHappening = false;
  
  // Read save
  
  if(localStorage.getItem('noticeShowna') == undefined){
    document.getElementById('noticeText').style.opacity = '1';
    setTimeout(function(){
      document.getElementById('notice').style.opacity = '0';
      document.getElementById('notice').style.pointerEvents = 'none';
    }, 5000);
  } else {
    document.getElementById('notice').style.visibility = 'hidden';
  }

  

  document.getElementById('click').addEventListener('click', function() {
  localStorage.removeItem('nextEvent');
  localStorage.removeItem('unlockedUpgrades');
  localStorage.removeItem('noticeShown');
  localStorage.removeItem('money');
  localStorage.removeItem('mpc');
    localStorage.removeItem('mps');
    localStorage.removeItem('mpcBots');
    localStorage.removeItem('autoBots');
    localStorage.removeItem('supers');
    localStorage.removeItem('autoMult');
    localStorage.removeItem('mpcMult');
  window.location.assign("../index.html");
  });

})();