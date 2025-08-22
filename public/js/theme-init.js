(function(){
  try {
    const ls = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = ls ? (ls === 'dark') : prefersDark;
    if (dark) {
      document.documentElement.classList.add('dark');
    }
  } catch(_) {}
})();


