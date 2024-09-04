document.addEventListener('DOMContentLoaded', () => {
    let kamerrorn = localStorage.getItem('kamerrorn');
    
    if (kamerrorn == 1) {
      document.getElementById('reasons').innerText = 'You are currently banned.';
    } else if (kamerrorn == 2) {
      document.getElementById('reasons').innerText = 'You are not playing the game yet!';
    } else if (kamerrorn == 3) {
      document.getElementById('reasons').innerText = 'Your game state is corrupted. You may have to retry again.';
    }
  });
  