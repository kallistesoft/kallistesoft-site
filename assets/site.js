// Light/dark switch. The inline script in each page's <head> has already set
// <html data-theme> (stored choice, else the system setting) before paint.
(function () {
  var root = document.documentElement;
  var button = document.querySelector('.theme-toggle');
  if (!button) return;

  function label() {
    var dark = root.dataset.theme === 'dark';
    button.setAttribute('aria-label', button.dataset[dark ? 'toLight' : 'toDark']);
    button.title = button.getAttribute('aria-label');
  }

  button.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.classList.add('theme-anim');
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    label();
    // Replay the icon's entrance animation.
    button.querySelectorAll('svg').forEach(function (svg) {
      svg.style.animation = 'none';
      void svg.offsetWidth;
      svg.style.animation = '';
    });
    setTimeout(function () { root.classList.remove('theme-anim'); }, 500);
  });

  // Follow the system setting while the visitor hasn't picked a theme.
  var media = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  if (media && media.addEventListener) {
    media.addEventListener('change', function (e) {
      var stored = null;
      try { stored = localStorage.getItem('theme'); } catch (err) {}
      if (stored) return;
      root.dataset.theme = e.matches ? 'dark' : 'light';
      label();
    });
  }

  label();
})();
