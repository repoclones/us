(function(){
  const status = document.getElementById('status');
  function add(msg){ if(!status) return; const li = document.createElement('li'); li.textContent = msg; status.appendChild(li); }
  add('App initialized');
  if (navigator.onLine) { add('Online'); } else { add('Offline'); }
  window.addEventListener('online', ()=>add('Connection restored'));
  window.addEventListener('offline', ()=>add('Connection lost'));
})();