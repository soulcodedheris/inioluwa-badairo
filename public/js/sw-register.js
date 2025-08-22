(function(){
  if (!('serviceWorker' in navigator)) return;
  var isProd = location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
  if (isProd) {
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('/sw.js')
        .then(function(reg){ try { reg.active && reg.active.postMessage({ type: 'WARM_CACHE' }); } catch(e){} })
        .catch(function(){});
    });
  } else {
    // Ensure no SW controls dev to avoid cache issues (white screen)
    navigator.serviceWorker.getRegistrations && navigator.serviceWorker.getRegistrations().then(function(regs){
      regs.forEach(function(r){ r.unregister(); });
    });
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage && navigator.serviceWorker.controller.postMessage({ type: 'SKIP' });
    }
  }
})();


