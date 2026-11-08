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

// FR/EN links: remember the choice so the home page stops following the
// browser's language (see .htaccess).
document.querySelectorAll('a[hreflang]').forEach(function (link) {
  link.addEventListener('click', function () {
    document.cookie = 'lang=' + link.hreflang.slice(0, 2) + '; path=/; max-age=31536000; SameSite=Lax';
  });
});

// Far West Frontier showcase: the trailer is a poster until the visitor asks
// for it (no YouTube script on page load), then the embed is injected.
document.querySelectorAll('.trailer .play').forEach(function (play) {
  play.addEventListener('click', function () {
    var box = play.parentNode;
    var frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/' + box.dataset.video + '?autoplay=1&rel=0&playsinline=1&hl=' + (document.documentElement.lang || 'en').slice(0, 2);
    frame.title = play.dataset.title || 'Trailer';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.setAttribute('allowfullscreen', '');
    box.appendChild(frame);
    play.remove();
  });
});
// "Watch the trailer" button: scroll to the player and start it.
document.querySelectorAll('a[href="#trailer"]').forEach(function (link) {
  link.addEventListener('click', function () {
    var play = document.querySelector('.trailer .play');
    if (play) play.click();
  });
});

// Screenshot lightbox: the thumbnails are buttons, the full image opens in a
// <dialog>, arrows and swipe-style buttons move between shots.
(function () {
  var dialog = document.querySelector('.lightbox');
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shots button'));
  if (!dialog || !shots.length || !dialog.showModal) return;
  var img = dialog.querySelector('img');
  var cap = dialog.querySelector('figcaption');
  var index = 0;

  function show(i) {
    index = (i + shots.length) % shots.length;
    var thumb = shots[index].querySelector('img');
    img.src = shots[index].dataset.full || thumb.src;
    img.alt = thumb.alt;
    cap.textContent = thumb.alt;
  }

  shots.forEach(function (button, i) {
    button.addEventListener('click', function () {
      show(i);
      dialog.showModal();
    });
  });
  dialog.querySelector('.prev').addEventListener('click', function () { show(index - 1); });
  dialog.querySelector('.next').addEventListener('click', function () { show(index + 1); });
  dialog.querySelector('.close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();
