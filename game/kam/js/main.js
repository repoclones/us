document.addEventListener('DOMContentLoaded', () => {
    let kamstatusn = localStorage.getItem("kamstatusn");
    let banReason = localStorage.getItem("banReason");
    let kamscore = localStorage.getItem("kamscore");
  
    if (kamstatusn === null) {
      kamstatusn = 0;
      localStorage.setItem('kamstatusn', 0);
    }
    if (kamscore === null) {
      kamscore = 0;
      localStorage.setItem('kamscore', 0);
    }
    if (kamstatusn == 1) {
      document.getElementById("status").innerHTML = `You are currently banned from playing this game.<br><b>Reason:</b> ` + banReason + `<br><br>Your score is <gig id="score">0</gig>.`;
      document.getElementById("score").innerHTML = kamscore;
    } else {
      let startButtonHTML = '<button onclick="startGame();" class="btn btn-primary"> Play </button>';
      if (kamstatusn == 0) {
        document.getElementById("status").innerHTML = `You can now play the game. This is your first time playing.`;
      } else if (kamstatusn == 2) {
        document.getElementById("status").innerHTML = `You can now play the game. Score: <gig id="score">0</gig>`;
        document.getElementById("score").innerHTML = kamscore;
      }
      document.getElementById("btn-start").innerHTML = startButtonHTML;
    }
  });
  
  function startGame() {
    localStorage.setItem('kamscore', 0);
    window.location.assign('./game.html');
  }
  