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

// Trailer modal: any [data-trailer] button opens the YouTube embed in a
// <dialog>; the iframe is created on open and removed on close so nothing
// from YouTube loads before the visitor asks, and playback stops on close.
(function () {
  var dialog = document.querySelector('.video-modal');
  var buttons = document.querySelectorAll('[data-trailer]');
  if (!dialog || !buttons.length || !dialog.showModal) return;
  var frame = dialog.querySelector('.frame');
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var video = document.createElement('iframe');
      video.src = 'https://www.youtube-nocookie.com/embed/' + button.dataset.trailer + '?autoplay=1&rel=0&playsinline=1&hl=' + (document.documentElement.lang || 'en').slice(0, 2);
      video.title = button.dataset.title || 'Trailer';
      video.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      video.setAttribute('allowfullscreen', '');
      frame.replaceChildren(video);
      dialog.showModal();
    });
  });
  dialog.querySelector('.close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', function () { frame.replaceChildren(); });
})();

// Short links from our social profiles (/yt, /ig, /tt → ?src=youtube|instagram|tiktok, see .htaccess): every
// Google Play link on the page gets that source as its install referrer, so Play Console can tell which platform
// brought an install. Nothing is stored about the visitor beyond this tab's session.
(function () {
  var allowed = { youtube: 1, instagram: 1, tiktok: 1 };
  var src = null;
  try {
    src = new URLSearchParams(location.search).get('src') || sessionStorage.getItem('src');
    if (src && allowed[src]) sessionStorage.setItem('src', src);
  } catch (e) {}
  if (!src || !allowed[src]) return;
  document.querySelectorAll('a[href*="play.google.com/store/apps/details"]').forEach(function (a) {
    try {
      var url = new URL(a.href);
      var app = (url.searchParams.get('id') || '').split('.').pop();
      url.searchParams.set('referrer', 'utm_source=' + src + '&utm_medium=social&utm_campaign=' + app);
      a.href = url.toString();
    } catch (e) {}
  });
})();
